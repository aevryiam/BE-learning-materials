/**
 * USER CONTROLLER (Logic Layer)
 * Mengatur CRUD operations untuk User
 */

import { Request, Response } from "express";
import User from "../models/userModel";

/**
 * @desc    Get semua users
 * @route   GET /api/users
 * @access  Private/Admin
 */
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    // Query parameters untuk filtering & pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select("-password") // Jangan tampilkan password
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 }); // Urutkan dari yang terbaru

    const total = await User.countDocuments();

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    const err = error as Error;
    console.error("Get Users Error:", err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data users",
      error: err.message,
    });
  }
};

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    const err = error as Error;
    console.error("Get User By ID Error:", err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data user",
      error: err.message,
    });
  }
};

/**
 * @desc    Update user
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      {
        new: true, // Return updated document
        runValidators: true, // Jalankan validasi schema
      }
    ).select("-password");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User berhasil diupdate",
      data: user,
    });
  } catch (error) {
    const err = error as Error;
    console.error("Update User Error:", err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat update user",
      error: err.message,
    });
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User berhasil dihapus",
    });
  } catch (error) {
    const err = error as Error;
    console.error("Delete User Error:", err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menghapus user",
      error: err.message,
    });
  }
};
