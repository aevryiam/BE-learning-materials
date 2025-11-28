/**
 * AUTH ROUTES
 * Definisi endpoint untuk autentikasi
 */

import express from "express";
import { register, login, getMe } from "../controllers/authController";
import { protect } from "../middleware/auth";

const router = express.Router();

/**
 * POST /api/auth/register - Register user baru
 * Body: { name, email, password, role? }
 */
router.post("/register", register);

/**
 * POST /api/auth/login - Login user
 * Body: { email, password }
 */
router.post("/login", login);

/**
 * GET /api/auth/me - Get profil user yang login
 * Headers: Authorization: Bearer <token>
 */
router.get("/me", protect, getMe);

export default router;
