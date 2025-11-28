/**
 * COURSE MODEL (Data Layer - Supabase)
 *
 * Handle database operations untuk Courses table di Supabase.
 * Termasuk filtering, searching, dan enrollment management.
 */

import { supabaseAdmin } from "../config/supabase";
import type { Database } from "../types/supabase";

type CourseRow = Database["public"]["Tables"]["courses"]["Row"];
type CourseInsert = Database["public"]["Tables"]["courses"]["Insert"];
type CourseUpdate = Database["public"]["Tables"]["courses"]["Update"];

interface CourseFilters {
  search?: string;
  category?: string;
  level?: "beginner" | "intermediate" | "advanced";
  instructor_id?: string;
  page?: number;
  limit?: number;
}

/**
 * Course Model Class
 */
class CourseModel {
  /**
   * Find course by ID
   */
  async findById(id: string): Promise<CourseRow | null> {
    const { data, error } = await supabaseAdmin
      .from("courses")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error finding course by ID:", error);
      return null;
    }

    return data;
  }

  /**
   * Get all courses with filters and pagination
   */
  async findAll(filters: CourseFilters = {}) {
    const {
      search,
      category,
      level,
      instructor_id,
      page = 1,
      limit = 10,
    } = filters;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabaseAdmin
      .from("courses")
      .select("*", { count: "exact" })
      .range(from, to)
      .order("created_at", { ascending: false });

    // Apply filters
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (category) {
      query = query.eq("category", category);
    }

    if (level) {
      query = query.eq("level", level);
    }

    if (instructor_id) {
      query = query.eq("instructor_id", instructor_id);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error finding courses:", error);
      throw new Error(error.message);
    }

    return {
      courses: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  /**
   * Create new course
   */
  async create(courseData: CourseInsert): Promise<CourseRow> {
    const { data, error } = await supabaseAdmin
      .from("courses")
      .insert(courseData as never)
      .select()
      .single();

    if (error) {
      console.error("Error creating course:", error);
      throw new Error(error.message);
    }

    return data;
  }

  /**
   * Update course
   */
  async update(id: string, updates: CourseUpdate): Promise<CourseRow> {
    const { data, error } = await supabaseAdmin
      .from("courses")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      } as never)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating course:", error);
      throw new Error(error.message);
    }

    return data;
  }

  /**
   * Delete course
   */
  async delete(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin.from("courses").delete().eq("id", id);

    if (error) {
      console.error("Error deleting course:", error);
      throw new Error(error.message);
    }

    return true;
  }

  /**
   * Get courses by instructor
   */
  async findByInstructor(
    instructorId: string,
    page: number = 1,
    limit: number = 10
  ) {
    return this.findAll({ instructor_id: instructorId, page, limit });
  }

  /**
   * Search courses
   */
  async search(searchTerm: string, page: number = 1, limit: number = 10) {
    return this.findAll({ search: searchTerm, page, limit });
  }

  /**
   * Get enrolled students count
   */
  async getEnrolledCount(courseId: string): Promise<number> {
    const { count, error } = await supabaseAdmin
      .from("enrollments")
      .select("*", { count: "exact", head: true })
      .eq("course_id", courseId);

    if (error) {
      console.error("Error counting enrollments:", error);
      return 0;
    }

    return count || 0;
  }

  /**
   * Enroll student to course
   */
  async enrollStudent(userId: string, courseId: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from("enrollments")
      .insert({ user_id: userId, course_id: courseId } as never);

    if (error) {
      console.error("Error enrolling student:", error);
      throw new Error(error.message);
    }

    return true;
  }

  /**
   * Unenroll student from course
   */
  async unenrollStudent(userId: string, courseId: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from("enrollments")
      .delete()
      .eq("user_id", userId)
      .eq("course_id", courseId);

    if (error) {
      console.error("Error unenrolling student:", error);
      throw new Error(error.message);
    }

    return true;
  }

  /**
   * Check if user is enrolled
   */
  async isEnrolled(userId: string, courseId: string): Promise<boolean> {
    const { data, error } = await supabaseAdmin
      .from("enrollments")
      .select("id")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error checking enrollment:", error);
    }

    return !!data;
  }

  /**
   * Get user's enrolled courses
   */
  async getUserEnrollments(userId: string) {
    const { data, error } = await supabaseAdmin
      .from("enrollments")
      .select("course_id, courses(*)")
      .eq("user_id", userId);

    if (error) {
      console.error("Error getting user enrollments:", error);
      throw new Error(error.message);
    }

    return data || [];
  }
}

// Export instance
const courseModel = new CourseModel();
export default courseModel;
