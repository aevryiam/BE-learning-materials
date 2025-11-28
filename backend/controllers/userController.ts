/**
 * USER CONTROLLER (Logic Layer - Supabase)
 * Mengatur CRUD operations untuk User menggunakan Supabase
 */

import { Request, Response } from "express";
import UserModel from "../models/userModel";

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

    const result = await UserModel.findAll(page, limit);

    res.status(200).json({
      success: true,
      data: result.users,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
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
    const user = await UserModel.findById(req.params.id);

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

    const user = await UserModel.update(req.params.id, {
      name,
      email,
      role,
    });

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
    const result = await UserModel.delete(req.params.id);

    if (!result) {
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
