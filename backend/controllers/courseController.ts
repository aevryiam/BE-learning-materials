/**
 * COURSE CONTROLLER (Logic Layer)
 * Mengatur CRUD operations untuk Course
 */

import { Request, Response } from "express";
import Course from "../models/courseModel";

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
    const skip = (page - 1) * limit;
    const category = req.query.category as string;
    const level = req.query.level as string;
    const search = req.query.search as string;

    // Build filter object
    const filter: Record<string, unknown> = { isPublished: true };

    if (category) filter.category = category;
    if (level) filter.level = level;
    if (search) {
      filter.$text = { $search: search };
    }

    const courses = await Course.find(filter)
      .populate("instructor", "name email") // Populate data instructor
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Course.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: courses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
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
    const course = await Course.findById(req.params.id).populate(
      "instructor",
      "name email"
    );

    if (!course) {
      res.status(404).json({
        success: false,
        message: "Course tidak ditemukan",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: course,
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

    // Instructor ID dari user yang login (diset di middleware auth)
    const instructorId = (req as unknown as { user: { id: string } }).user.id;

    const course = await Course.create({
      title,
      description,
      instructor: instructorId,
      category,
      level,
      price,
      duration,
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
    const course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404).json({
        success: false,
        message: "Course tidak ditemukan",
      });
      return;
    }

    // Cek apakah user adalah instructor dari course ini
    const userId = (req as unknown as { user: { id: string } }).user.id;
    if (course.instructor.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses untuk mengupdate course ini",
      });
      return;
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

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
    const course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404).json({
        success: false,
        message: "Course tidak ditemukan",
      });
      return;
    }

    // Cek apakah user adalah instructor dari course ini
    const userId = (req as unknown as { user: { id: string } }).user.id;
    if (course.instructor.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses untuk menghapus course ini",
      });
      return;
    }

    await Course.findByIdAndDelete(req.params.id);

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
