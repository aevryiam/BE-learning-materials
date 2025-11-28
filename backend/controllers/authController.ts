/**
 * AUTH CONTROLLER (Logic Layer - Supabase)
 *
 * Mengatur logika bisnis untuk autentikasi menggunakan Supabase Auth.
 * Supabase menyediakan built-in authentication dengan JWT tokens.
 */

import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { supabaseAdmin } from "../config/supabase";
import UserModel from "../models/userModel";

// Interface untuk request body
interface RegisterBody {
  name: string;
  email: string;
  password: string;
  role?: "student" | "instructor" | "admin";
}

interface LoginBody {
  email: string;
  password: string;
}

/**
 * @desc    Register user baru
 * @route   POST /api/auth/register
 * @access  Public
 *
 * Menggunakan Supabase Auth untuk create user, lalu simpan data tambahan di users table
 */
export const register = async (
  req: Request<object, object, RegisterBody>,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    // Validasi input
    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Semua field harus diisi (name, email, password)",
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: "Password minimal 6 karakter",
      });
      return;
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "Email sudah terdaftar",
      });
      return;
    }

    // 1. Create user di Supabase Auth
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          name,
          role: role || "student",
        },
      });

    if (authError || !authData.user) {
      console.error("Supabase Auth Error:", authError);
      res.status(500).json({
        success: false,
        message: "Gagal membuat akun di Supabase Auth",
        error: authError?.message,
      });
      return;
    }

    // 2. Simpan data tambahan di users table
    const user = await UserModel.create({
      id: authData.user.id,
      email,
      name,
      role: role || "student",
    });

    // 3. Generate JWT Token (opsional, atau bisa pakai Supabase session)
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "User berhasil didaftarkan",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    const err = error as Error;
    console.error("Register Error:", err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat registrasi",
      error: err.message,
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 *
 * Menggunakan Supabase Auth untuk sign in
 */
export const login = async (
  req: Request<object, object, LoginBody>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email dan password harus diisi",
      });
      return;
    }

    // 1. Sign in dengan Supabase Auth
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.signInWithPassword({
        email,
        password,
      });

    if (authError || !authData.user) {
      res.status(401).json({
        success: false,
        message: "Email atau password salah",
        error: authError?.message,
      });
      return;
    }

    // 2. Ambil data lengkap dari users table
    const user = await UserModel.findById(authData.user.id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "Data user tidak ditemukan di database",
      });
      return;
    }

    // 3. Generate JWT Token (atau bisa pakai authData.session.access_token)
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login berhasil",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
        // supabaseSession: authData.session, // Opsional: return Supabase session
      },
    });
  } catch (error) {
    const err = error as Error;
    console.error("Login Error:", err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat login",
      error: err.message,
    });
  }
};

/**
 * @desc    Get profil user yang sedang login
 * @route   GET /api/auth/me
 * @access  Private (butuh token)
 */
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    // req.user sudah diset oleh middleware auth
    const userId = (req as unknown as { user: { id: string } }).user.id;
    const user = await UserModel.findById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    const err = error as Error;
    console.error("Get Me Error:", err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan",
      error: err.message,
    });
  }
};
