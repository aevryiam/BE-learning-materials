/**
 * AUTH CONTROLLER (Logic Layer)
 * Mengatur logika bisnis untuk autentikasi (Register & Login)
 */

import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

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

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "Email sudah terdaftar",
      });
      return;
    }

    // Buat user baru (password akan di-hash otomatis oleh middleware di model)
    const user = await User.create({
      name,
      email,
      password,
      role: role || "student",
    });

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "User berhasil didaftarkan",
      data: {
        user: {
          id: user._id,
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

    // Cari user dan ambil password (select: false by default)
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
      return;
    }

    // Cek password menggunakan method dari model
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
      return;
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login berhasil",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
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
    const user = await User.findById(
      (req as unknown as { user: { id: string } }).user.id
    );

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
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
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
