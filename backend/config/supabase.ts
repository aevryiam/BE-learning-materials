/**
 * SUPABASE CLIENT CONFIGURATION
 *
 * Inisialisasi Supabase client untuk digunakan di seluruh backend.
 * Supabase menyediakan:
 * - PostgreSQL database
 * - Authentication & Authorization (JWT)
 * - Real-time subscriptions
 * - Storage untuk files
 * - Auto-generated REST APIs
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase";

// Validasi environment variables
if (!process.env.SUPABASE_URL) {
  throw new Error("Missing SUPABASE_URL environment variable");
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable");
}

/**
 * Supabase Admin Client
 *
 * Menggunakan SERVICE_ROLE_KEY untuk:
 * - Bypass Row Level Security (RLS)
 * - Full database access
 * - User management
 *
 * ⚠️ PENTING: Hanya digunakan di backend, JANGAN expose ke frontend!
 */
export const supabaseAdmin: SupabaseClient<Database> = createClient<Database>(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * Supabase Client (dengan Anon Key)
 *
 * Untuk operasi yang mengikuti RLS policies
 * Lebih aman untuk operasi yang tidak memerlukan admin access
 */
export const supabase: SupabaseClient<Database> = createClient<Database>(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY || "",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Log koneksi (hanya di development)
if (process.env.NODE_ENV === "development") {
  console.log("✅ Supabase client initialized");
  console.log(`📍 Project URL: ${process.env.SUPABASE_URL}`);
}

export default supabaseAdmin;
