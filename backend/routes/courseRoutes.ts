/**
 * COURSE ROUTES
 * Definisi endpoint untuk course management
 */

import express from "express";
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController";
import { protect, authorize } from "../middleware/auth";

const router = express.Router();

/**
 * GET /api/courses - Get semua courses (public)
 * Query: ?page=1&limit=10&category=programming&level=beginner&search=javascript
 */
router.get("/", getCourses);

/**
 * GET /api/courses/:id - Get single course (public)
 */
router.get("/:id", getCourseById);

/**
 * POST /api/courses - Create course (instructor only)
 * Body: { title, description, category, level, price, duration }
 */
router.post("/", protect, authorize("instructor", "admin"), createCourse);

/**
 * PUT /api/courses/:id - Update course (instructor owner only)
 * Body: { title?, description?, category?, level?, price?, duration?, isPublished? }
 */
router.put("/:id", protect, authorize("instructor", "admin"), updateCourse);

/**
 * DELETE /api/courses/:id - Delete course (instructor owner only)
 */
router.delete("/:id", protect, authorize("instructor", "admin"), deleteCourse);

export default router;
