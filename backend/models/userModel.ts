/**
 * USER MODEL (Data Layer - Supabase)
 *
 * Handle database operations untuk Users table di Supabase.
 * Berbeda dengan Mongoose, di Supabase kita:
 * - Tidak perlu define schema (sudah di PostgreSQL)
 * - Menggunakan Supabase client untuk query
 * - Password hashing di controller (Supabase Auth handle auth)
 */

import { supabaseAdmin } from "../config/supabase";
import type { Database } from "../types/supabase";
import bcrypt from "bcryptjs";

type UserRow = Database["public"]["Tables"]["users"]["Row"];
type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
type UserUpdate = Database["public"]["Tables"]["users"]["Update"];

/**
 * User Model Class
 * Encapsulate semua database operations untuk users
 */
class UserModel {
  /**
   * Find user by ID
   */
  async findById(id: string): Promise<UserRow | null> {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error finding user by ID:", error);
      return null;
    }

    return data;
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<UserRow | null> {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // Not found
        return null;
      }
      console.error("Error finding user by email:", error);
      return null;
    }

    return data;
  }

  /**
   * Get all users with pagination
   */
  async findAll(page: number = 1, limit: number = 10) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabaseAdmin
      .from("users")
      .select("*", { count: "exact" })
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error finding all users:", error);
      throw new Error(error.message);
    }

    return {
      users: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  /**
   * Create new user
   * Note: Password hashing dilakukan di controller
   */
  async create(userData: UserInsert): Promise<UserRow> {
    const { data, error } = await supabaseAdmin
      .from("users")
      .insert(userData as never)
      .select()
      .single();

    if (error) {
      console.error("Error creating user:", error);
      throw new Error(error.message);
    }

    return data;
  }

  /**
   * Update user
   */
  async update(id: string, updates: UserUpdate): Promise<UserRow> {
    const { data, error } = await supabaseAdmin
      .from("users")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      } as never)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating user:", error);
      throw new Error(error.message);
    }

    return data;
  }

  /**
   * Delete user
   */
  async delete(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin.from("users").delete().eq("id", id);

    if (error) {
      console.error("Error deleting user:", error);
      throw new Error(error.message);
    }

    return true;
  }

  /**
   * Count users by role
   */
  async countByRole(role: "student" | "instructor" | "admin"): Promise<number> {
    const { count, error } = await supabaseAdmin
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", role);

    if (error) {
      console.error("Error counting users:", error);
      return 0;
    }

    return count || 0;
  }

  /**
   * Hash password
   * Helper method untuk password hashing
   */
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  /**
   * Compare password
   * Helper method untuk verify password
   */
  async comparePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

// Export instance
const userModel = new UserModel();
export default userModel;
