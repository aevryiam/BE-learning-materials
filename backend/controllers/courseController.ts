/**
 * COURSE CONTROLLER (Logic Layer - Supabase)
 * Mengatur CRUD operations untuk Course menggunakan Supabase
 */

import { Request, Response } from "express";
import CourseModel from "../models/courseModel";

/**
 * @desc    Get semua courses
 * @route   GET /api/courses
 * @access  Public
 */
export const getCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Query parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const category = req.query.category as string;
    const level = req.query.level as "beginner" | "intermediate" | "advanced";
    const search = req.query.search as string;

    const result = await CourseModel.findAll({
      page,
      limit,
      category,
      level,
      search,
    });

    res.status(200).json({
      success: true,
      data: result.courses,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    const err = error as Error;
    console.error("Get Courses Error:", err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data courses",
      error: err.message,
    });
  }
};

/**
 * @desc    Get single course
 * @route   GET /api/courses/:id
 * @access  Public
 */
export const getCourseById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const course = await CourseModel.findById(req.params.id);

    if (!course) {
      res.status(404).json({
        success: false,
        message: "Course tidak ditemukan",
      });
      return;
    }

    // Get enrolled students count
    const enrolledCount = await CourseModel.getEnrolledCount(req.params.id);

    res.status(200).json({
      success: true,
      data: {
        ...course,
        enrolled_students_count: enrolledCount,
      },
    });
  } catch (error) {
    const err = error as Error;
    console.error("Get Course Error:", err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data course",
      error: err.message,
    });
  }
};

/**
 * @desc    Create course
 * @route   POST /api/courses
 * @access  Private/Instructor
 */
export const createCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, description, category, level, price, duration } = req.body;

    // Validasi input
    if (!title || !description || !category || !level || !duration) {
      res.status(400).json({
        success: false,
        message: "Semua field wajib diisi",
      });
      return;
    }

    // Instructor ID dari user yang login (diset di middleware auth)
    const instructorId = (req as unknown as { user: { id: string } }).user.id;

    const course = await CourseModel.create({
      title,
      description,
      category,
      level,
      price: price || 0,
      duration,
      instructor_id: instructorId,
    });

    res.status(201).json({
      success: true,
      message: "Course berhasil dibuat",
      data: course,
    });
  } catch (error) {
    const err = error as Error;
    console.error("Create Course Error:", err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat membuat course",
      error: err.message,
    });
  }
};

/**
 * @desc    Update course
 * @route   PUT /api/courses/:id
 * @access  Private/Instructor (owner only)
 */
export const updateCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const course = await CourseModel.findById(req.params.id);

    if (!course) {
      res.status(404).json({
        success: false,
        message: "Course tidak ditemukan",
      });
      return;
    }

    // Cek apakah user adalah instructor dari course ini
    const userId = (req as unknown as { user: { id: string } }).user.id;
    const userRole = (req as unknown as { user: { role: string } }).user.role;

    if (course.instructor_id !== userId && userRole !== "admin") {
      res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses untuk mengupdate course ini",
      });
      return;
    }

    const { title, description, category, level, price, duration } = req.body;

    const updatedCourse = await CourseModel.update(req.params.id, {
      title,
      description,
      category,
      level,
      price,
      duration,
    });

    res.status(200).json({
      success: true,
      message: "Course berhasil diupdate",
      data: updatedCourse,
    });
  } catch (error) {
    const err = error as Error;
    console.error("Update Course Error:", err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat update course",
      error: err.message,
    });
  }
};

/**
 * @desc    Delete course
 * @route   DELETE /api/courses/:id
 * @access  Private/Instructor (owner only)
 */
export const deleteCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const course = await CourseModel.findById(req.params.id);

    if (!course) {
      res.status(404).json({
        success: false,
        message: "Course tidak ditemukan",
      });
      return;
    }

    // Cek apakah user adalah instructor dari course ini
    const userId = (req as unknown as { user: { id: string } }).user.id;
    const userRole = (req as unknown as { user: { role: string } }).user.role;

    if (course.instructor_id !== userId && userRole !== "admin") {
      res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses untuk menghapus course ini",
      });
      return;
    }

    await CourseModel.delete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Course berhasil dihapus",
    });
  } catch (error) {
    const err = error as Error;
    console.error("Delete Course Error:", err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menghapus course",
      error: err.message,
    });
  }
};
