/**
 * AUTH MIDDLEWARE (Supabase Compatible)
 *
 * Middleware untuk autentikasi menggunakan JWT.
 * Support untuk:
 * - Custom JWT tokens (yang kita generate sendiri)
 * - Supabase Auth tokens (verify via Supabase)
 */

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { supabaseAdmin } from "../config/supabase";

// Interface untuk JWT payload
interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

/**
 * Middleware untuk verify JWT token
 * Token dikirim via header: Authorization: Bearer <token>
 *
 * Supports 2 modes:
 * 1. Custom JWT (our own tokens)
 * 2. Supabase Auth tokens (optional)
 */
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Ambil token dari Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Cek apakah token ada
    if (!token) {
      res.status(401).json({
        success: false,
        message: "Tidak terautentikasi. Token tidak ditemukan",
      });
      return;
    }

    try {
      // Try to verify as custom JWT first
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "default_secret"
      ) as JwtPayload;

      // Attach user info ke request object
      (req as unknown as { user: JwtPayload }).user = decoded;
      next();
    } catch {
      // If custom JWT fails, try Supabase Auth token
      const {
        data: { user },
        error,
      } = await supabaseAdmin.auth.getUser(token);

      if (error || !user) {
        res.status(401).json({
          success: false,
          message: "Token tidak valid atau expired",
        });
        return;
      }

      // Get user role from database
      const { data: userData } = await supabaseAdmin
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      // Attach user info from Supabase
      (req as unknown as { user: JwtPayload }).user = {
        id: user.id,
        email: user.email || "",
        role: (userData as { role: string } | null)?.role || "student",
      };

      next();
    }
  } catch (error) {
    const err = error as Error;
    console.error("Auth Middleware Error:", err);
    res.status(401).json({
      success: false,
      message: "Authentication failed",
      error: err.message,
    });
  }
};

/**
 * Middleware untuk otorisasi berdasarkan role
 * Contoh penggunaan: authorize('admin', 'instructor')
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = (req as { user?: JwtPayload }).user?.role;

    if (!roles.includes(userRole || "")) {
      res.status(403).json({
        success: false,
        message: `Role '${userRole}' tidak memiliki akses ke resource ini`,
      });
      return;
    }

    next();
  };
};
