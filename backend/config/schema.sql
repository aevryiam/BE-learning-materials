/**
 * SUPABASE DATABASE SCHEMA
 * 
 * Jalankan script SQL ini di Supabase SQL Editor untuk setup database.
 * Path: https://app.supabase.com → SQL Editor → New Query
 * 
 * Schema ini akan membuat:
 * 1. Tables: users, courses, enrollments
 * 2. Row Level Security (RLS) policies
 * 3. Triggers untuk auto-update timestamps
 */

-- =============================================
-- 1. USERS TABLE
-- =============================================
-- Extends Supabase Auth users dengan additional fields

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger untuk auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 2. COURSES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  price INTEGER NOT NULL DEFAULT 0,
  duration INTEGER NOT NULL,
  instructor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 3. ENROLLMENTS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- =============================================
-- 4. ENABLE ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 5. RLS POLICIES
-- =============================================

-- USERS POLICIES
-- Users can read their own data
CREATE POLICY "Users can view their own data" 
  ON users FOR SELECT 
  USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update their own data" 
  ON users FOR UPDATE 
  USING (auth.uid() = id);

-- Admin can view all users
CREATE POLICY "Admins can view all users" 
  ON users FOR SELECT 
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- COURSES POLICIES
-- Anyone authenticated can view courses
CREATE POLICY "Authenticated users can view courses" 
  ON courses FOR SELECT 
  TO authenticated 
  USING (true);

-- Instructors can create courses
CREATE POLICY "Instructors can create courses" 
  ON courses FOR INSERT 
  TO authenticated 
  WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) IN ('instructor', 'admin'));

-- Instructors can update their own courses
CREATE POLICY "Instructors can update their own courses" 
  ON courses FOR UPDATE 
  USING (instructor_id = auth.uid() OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Instructors can delete their own courses
CREATE POLICY "Instructors can delete their own courses" 
  ON courses FOR DELETE 
  USING (instructor_id = auth.uid() OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- ENROLLMENTS POLICIES
-- Users can view their own enrollments
CREATE POLICY "Users can view their own enrollments" 
  ON enrollments FOR SELECT 
  USING (user_id = auth.uid());

-- Students can enroll in courses
CREATE POLICY "Students can enroll in courses" 
  ON enrollments FOR INSERT 
  WITH CHECK (user_id = auth.uid());

-- Users can unenroll from courses
CREATE POLICY "Users can unenroll from courses" 
  ON enrollments FOR DELETE 
  USING (user_id = auth.uid());

-- =============================================
-- 6. INDEXES (untuk performance)
-- =============================================

CREATE INDEX IF NOT EXISTS idx_courses_instructor ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);

-- =============================================
-- DONE! 🎉
-- =============================================
-- Schema created successfully!
-- Next steps:
-- 1. Dapatkan API keys dari Settings → API
-- 2. Setup .env.local dengan credentials
-- 3. Run backend server: npm run server
