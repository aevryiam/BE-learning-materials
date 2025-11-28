/**
 * AUTH MIDDLEWARE
 * Middleware untuk autentikasi menggunakan JWT
 * Melindungi routes yang membutuhkan login
 */

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Interface untuk JWT payload
interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

/**
 * Middleware untuk verify JWT token
 * Token dikirim via header: Authorization: Bearer <token>
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

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default_secret"
    ) as JwtPayload;

    // Attach user info ke request object
    (req as unknown as { user: JwtPayload }).user = decoded;

    next();
  } catch (error) {
    const err = error as Error;
    console.error("Auth Middleware Error:", err);
    res.status(401).json({
      success: false,
      message: "Token tidak valid atau expired",
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
