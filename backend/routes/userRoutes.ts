/**
 * USER ROUTES
 * Definisi endpoint untuk user management
 */

import express from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import { protect, authorize } from "../middleware/auth";

const router = express.Router();

/**
 * Semua routes di bawah ini membutuhkan autentikasi dan role admin
 */
router.use(protect);
router.use(authorize("admin"));

/**
 * GET /api/users - Get semua users (dengan pagination)
 * Query: ?page=1&limit=10
 */
router.get("/", getUsers);

/**
 * GET /api/users/:id - Get user by ID
 */
router.get("/:id", getUserById);

/**
 * PUT /api/users/:id - Update user
 * Body: { name?, email?, role? }
 */
router.put("/:id", updateUser);

/**
 * DELETE /api/users/:id - Delete user
 */
router.delete("/:id", deleteUser);

export default router;
