/**
 * SUPABASE DATABASE TYPES
 *
 * Auto-generated types dari Supabase schema
 * Untuk generate otomatis, gunakan: npx supabase gen types typescript --project-id your-project-id
 *
 * Manual definition untuk sementara
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: "student" | "instructor" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          role?: "student" | "instructor" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: "student" | "instructor" | "admin";
          created_at?: string;
          updated_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          category: string;
          level: "beginner" | "intermediate" | "advanced";
          price: number;
          duration: number;
          instructor_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          category: string;
          level: "beginner" | "intermediate" | "advanced";
          price?: number;
          duration: number;
          instructor_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          category?: string;
          level?: "beginner" | "intermediate" | "advanced";
          price?: number;
          duration?: number;
          instructor_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      enrollments: {
        Row: {
          id: string;
          user_id: string | null;
          course_id: string | null;
          enrolled_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          course_id?: string | null;
          enrolled_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          course_id?: string | null;
          enrolled_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
