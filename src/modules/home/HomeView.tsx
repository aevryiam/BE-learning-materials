/**
 * Home Module
 * Landing page dengan learning resources
 */

"use client";

import Link from "next/link";

export default function HomeView() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-black">
          CollabLearn - Backend Learning Platform
        </h1>
        <p className="text-xl text-gray-700">
          Platform pembelajaran kolaboratif dengan backend Express.js MVC
          pattern dan frontend Next.js
        </p>
      </div>

      {/* MVC Concept Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-black">
          Konsep MVC (Model-View-Controller) + Supabase
        </h2>

        <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6 shadow-sm">
          <h3 className="text-2xl font-semibold mb-4 text-black">
            Apa itu MVC?
          </h3>
          <p className="text-gray-800 mb-4">
            MVC adalah pola arsitektur yang memisahkan aplikasi menjadi 3
            komponen utama:
          </p>
          <div className="space-y-3">
            <div className="border-l-4 border-blue-600 pl-4">
              <h4 className="font-semibold text-black">MODEL (Data Layer)</h4>
              <p className="text-gray-700">
                Mengatur database queries, schema validation, business logic
                untuk data. Dalam project ini menggunakan{" "}
                <strong>Supabase</strong> sebagai database & authentication.
              </p>
            </div>
            <div className="border-l-4 border-green-600 pl-4">
              <h4 className="font-semibold text-black">
                VIEW (Presentation Layer)
              </h4>
              <p className="text-gray-700">
                Dalam REST API, VIEW = JSON Response ke Frontend
              </p>
            </div>
            <div className="border-l-4 border-purple-600 pl-4">
              <h4 className="font-semibold text-black">
                CONTROLLER (Logic Layer)
              </h4>
              <p className="text-gray-700">
                Otak aplikasi, memproses request, memanggil model, kirim
                response
              </p>
            </div>
          </div>
        </div>

        {/* Supabase Introduction */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-300 rounded-lg p-6 mb-6 shadow-sm">
          <h3 className="text-2xl font-semibold mb-4 text-black">
            Kenapa Pakai Supabase?
          </h3>
          <p className="text-gray-800 mb-4">
            Supabase adalah <strong>Open Source Firebase Alternative</strong>{" "}
            yang menyediakan:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <h4 className="font-semibold text-green-700 mb-2">Database</h4>
              <p className="text-sm text-gray-700">
                PostgreSQL database dengan real-time subscriptions
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-700 mb-2">
                Authentication
              </h4>
              <p className="text-sm text-gray-700">
                Built-in auth dengan JWT, email/password, OAuth providers
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <h4 className="font-semibold text-purple-700 mb-2">Storage</h4>
              <p className="text-sm text-gray-700">
                File storage untuk images, videos, documents
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-orange-200">
              <h4 className="font-semibold text-orange-700 mb-2">
                Auto-generated APIs
              </h4>
              <p className="text-sm text-gray-700">
                REST & GraphQL APIs otomatis dari database schema
              </p>
            </div>
          </div>
          <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-700">
              <strong className="text-black">Keuntungan:</strong> Gratis untuk
              project kecil, scalable, dashboard yang user-friendly,
              documentation lengkap, dan TypeScript support.
            </p>
          </div>
        </div>

        {/* Request Flow */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6 shadow-sm">
          <h3 className="text-2xl font-semibold mb-4 text-black">
            Alur Data (Request Flow dengan Supabase)
          </h3>
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <pre className="text-sm text-black whitespace-pre-wrap">
              {`Client (Browser/Frontend)
    ↓
HTTP Request: GET /api/courses
    ↓
ROUTE (routes/courseRoutes.ts)
  • Menerima request
  • Memanggil controller function
    ↓
CONTROLLER (controllers/courseController.ts)
  • Validasi input
  • Panggil Model untuk query Supabase
  • Process data
    ↓
MODEL (models/courseModel.ts)
  • Query ke Supabase PostgreSQL
  • Return data ke Controller
    ↓
CONTROLLER
  • Terima data dari Model
  • Format response
    ↓
JSON Response
    ↓
Client (Frontend)`}
            </pre>
          </div>
        </div>

        {/* Folder Structure */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6 shadow-sm">
          <h3 className="text-2xl font-semibold mb-4 text-black">
            Struktur Folder MVC dengan Supabase
          </h3>
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <pre className="text-sm text-black whitespace-pre-wrap">
              {`backend/
├── config/              Konfigurasi
│   └── supabase.ts     → Supabase client initialization
│
├── models/             MODEL (Data Layer)
│   ├── userModel.ts    → User queries & validation
│   └── courseModel.ts  → Course queries & validation
│
├── controllers/        CONTROLLER (Logic)
│   ├── authController.ts    → Supabase Auth integration
│   ├── userController.ts
│   └── courseController.ts
│
├── routes/             ROUTES (Endpoints)
│   ├── authRoutes.ts
│   ├── userRoutes.ts
│   └── courseRoutes.ts
│
├── middleware/         Middleware
│   ├── auth.ts         → JWT verification (Supabase)
│   └── errorHandler.ts → Global error handling
│
├── types/              TypeScript Types
│   └── supabase.ts     → Database types (auto-generated)
│
└── server.ts           Entry Point`}
            </pre>
          </div>
        </div>

        {/* Concrete Example */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6 shadow-sm">
          <h3 className="text-2xl font-semibold mb-4 text-black">
            Contoh Konkret: Login User
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-black mb-2">
                1. CLIENT KIRIM REQUEST
              </h4>
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <code className="text-sm text-black">
                  POST http://localhost:3001/api/auth/login
                  <br />
                  Body: {`{ "email": "user@test.com", "password": "123456" }`}
                </code>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-black mb-2">
                2. ROUTE TERIMA REQUEST (routes/authRoutes.ts)
              </h4>
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <code className="text-sm text-black">
                  {`router.post('/login', login);`}
                  <br />→ Route mengarahkan ke controller function
                  &quot;login&quot;
                </code>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-black mb-2">
                3. CONTROLLER PROCESS
              </h4>
              <p className="text-gray-700 text-sm mb-2">
                Di controllers/authController.ts:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li>Ambil email & password dari request body</li>
                <li>Validasi input</li>
                <li>Panggil MODEL untuk cari user</li>
                <li>Cek password (method dari Model)</li>
                <li>Generate JWT token</li>
                <li>Kirim response</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-black mb-2">
                4. MODEL HANDLE DATABASE
              </h4>
              <p className="text-gray-700 text-sm">
                models/userModel.ts menangani:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li>Schema mendefinisikan struktur data</li>
                <li>Method comparePassword untuk cek password</li>
                <li>Middleware untuk hash password sebelum save</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-black mb-2">
                5. RESPONSE KE CLIENT
              </h4>
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <pre className="text-sm text-black">
                  {`{
  "success": true,
  "data": {
    "user": { "id": "...", "name": "...", "email": "..." },
    "token": "eyJhbGciOiJIUzI1..."
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Why MVC */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6 shadow-sm">
          <h3 className="text-2xl font-semibold mb-4 text-black">
            Kenapa Harus Pakai MVC?
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-red-700 mb-3">
                TANPA MVC (Code campur aduk)
              </h4>
              <div className="bg-red-50 border border-red-200 p-4 rounded">
                <p className="text-sm text-gray-700 mb-2">
                  server.ts menghandle semua:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  <li>Handle request</li>
                  <li>Validasi input</li>
                  <li>Query database</li>
                  <li>Hash password</li>
                  <li>Generate token</li>
                  <li>Send response</li>
                </ul>
                <div className="mt-3 text-red-700 text-sm space-y-1">
                  <p>→ Code jadi BERANTAKAN</p>
                  <p>→ Susah maintenance</p>
                  <p>→ Sulit testing</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-green-700 mb-3">
                DENGAN MVC (Terpisah rapi)
              </h4>
              <div className="bg-green-50 border border-green-200 p-4 rounded">
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
                  <li>MODEL → Urusan database saja</li>
                  <li>CONTROLLER → Urusan logika bisnis saja</li>
                  <li>ROUTE → Urusan endpoint saja</li>
                </ul>
                <div className="mt-3 text-green-700 text-sm space-y-1">
                  <p>→ Code TERORGANISIR</p>
                  <p>→ Mudah maintenance</p>
                  <p>→ Gampang testing</p>
                  <p>→ Team bisa kerja parallel</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6 shadow-sm">
          <h3 className="text-2xl font-semibold mb-4 text-black">
            Best Practices
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-black mb-2">
                1. Separation of Concerns
              </h4>
              <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                <li>Model fokus ke database schema & validasi</li>
                <li>Controller fokus ke business logic</li>
                <li>Route fokus ke endpoint mapping</li>
                <li>Middleware fokus ke authentication, validation</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-black mb-2">
                2. Fat Model, Thin Controller
              </h4>
              <p className="text-gray-700 text-sm mb-2">
                Taruh logic sebanyak mungkin di Model, Controller cuma
                orchestrate
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-50 border border-red-200 p-3 rounded">
                  <p className="text-sm font-semibold text-red-700 mb-2">
                    JANGAN di Controller
                  </p>
                  <code className="text-xs text-black">
                    const hashedPassword = await bcrypt.hash(password, 10);
                  </code>
                </div>
                <div className="bg-green-50 border border-green-200 p-3 rounded">
                  <p className="text-sm font-semibold text-green-700 mb-2">
                    TARUH di Model
                  </p>
                  <code className="text-xs text-black">
                    {`userSchema.pre('save', async function() {
  this.password = await bcrypt.hash(this.password, 10);
});`}
                  </code>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-black mb-2">
                3. Standard Response Format
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-green-700 mb-2">
                    Success:
                  </p>
                  <div className="bg-gray-50 p-2 rounded border border-gray-200">
                    <pre className="text-xs text-black">
                      {`{
  "success": true,
  "message": "...",
  "data": { ... }
}`}
                    </pre>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-700 mb-2">
                    Error:
                  </p>
                  <div className="bg-gray-50 p-2 rounded border border-gray-200">
                    <pre className="text-xs text-black">
                      {`{
  "success": false,
  "message": "...",
  "error": "..."
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-black">Quick Start</h2>

        <div className="bg-white border border-gray-300 rounded-lg p-6 mb-4 shadow-sm">
          <h3 className="text-xl font-semibold mb-3 text-black">
            Prerequisites
          </h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Node.js (v18+)</li>
            <li>
              Akun Supabase (gratis di{" "}
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                supabase.com
              </a>
              )
            </li>
            <li>npm atau yarn</li>
          </ul>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-6 mb-4 shadow-sm">
          <h3 className="text-xl font-semibold mb-3 text-black">
            1. Setup Supabase Project
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-700 mb-2">
                <strong>a) Buat Project Baru</strong>
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
                <li>
                  Login ke{" "}
                  <a
                    href="https://app.supabase.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    app.supabase.com
                  </a>
                </li>
                <li>Klik &quot;New Project&quot;</li>
                <li>
                  Isi nama project, database password, dan pilih region terdekat
                </li>
                <li>Tunggu provisioning selesai (~2 menit)</li>
              </ul>
            </div>

            <div>
              <p className="text-sm text-gray-700 mb-2">
                <strong>b) Setup Database Tables</strong>
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Buka SQL Editor dan jalankan script ini:
              </p>
              <div className="bg-gray-900 text-gray-100 p-4 rounded text-xs overflow-auto">
                <pre>{`-- Users table (extends Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE courses (
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

-- Enrollments table
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Policies (basic - customize as needed)
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Anyone can view courses" ON courses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Instructors can create courses" ON courses FOR INSERT TO authenticated 
  WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'instructor');`}</pre>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-700 mb-2">
                <strong>c) Dapatkan API Keys</strong>
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
                <li>Pergi ke Settings → API</li>
                <li>
                  Copy <strong>Project URL</strong> dan{" "}
                  <strong>anon/public key</strong>
                </li>
                <li>Simpan untuk digunakan di .env.local</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-6 mb-4 shadow-sm">
          <h3 className="text-xl font-semibold mb-3 text-black">
            2. Install Dependencies
          </h3>
          <div className="bg-gray-900 text-gray-100 p-4 rounded">
            <code>npm install</code>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Package utama: @supabase/supabase-js, express, cors, jsonwebtoken
          </p>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-6 mb-4 shadow-sm">
          <h3 className="text-xl font-semibold mb-3 text-black">
            3. Setup Environment (.env.local)
          </h3>
          <div className="bg-gray-900 text-gray-100 p-4 rounded">
            <pre className="text-sm">
              {`# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# JWT Configuration (get from Supabase Settings → API → JWT Secret)
JWT_SECRET=your-supabase-jwt-secret

# Server Configuration
PORT=3001
FRONTEND_URL=http://localhost:3000
NODE_ENV=development`}
            </pre>
          </div>
          <p className="text-sm text-yellow-700 bg-yellow-50 p-3 rounded mt-3 border border-yellow-200">
            <strong>Penting:</strong> Service Role Key hanya digunakan di
            backend untuk bypass RLS. Jangan pernah expose ke frontend!
          </p>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-3 text-black">
            4. Run Servers
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold text-black mb-2">
                Backend (Terminal 1):
              </p>
              <div className="bg-gray-900 text-gray-100 p-3 rounded mb-2">
                <code>npm run server</code>
              </div>
              <p className="text-sm text-gray-600">→ http://localhost:3001</p>
            </div>
            <div>
              <p className="font-semibold text-black mb-2">
                Frontend (Terminal 2):
              </p>
              <div className="bg-gray-900 text-gray-100 p-3 rounded mb-2">
                <code>npm run dev</code>
              </div>
              <p className="text-sm text-gray-600">→ http://localhost:3000</p>
            </div>
          </div>
        </div>
      </section>

      {/* API Testing Link */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-black">Testing</h2>
        <Link
          href="/api-testing"
          className="block bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-lg shadow-md transition"
        >
          <h3 className="text-2xl font-semibold mb-2">API Testing Interface</h3>
          <p className="text-purple-100">
            Test semua API endpoint secara interaktif langsung dari browser
          </p>
          <p className="text-sm text-purple-200 mt-3 font-medium">
            Klik untuk mulai testing →
          </p>
        </Link>
      </section>

      {/* Features */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-black">Features</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-300 rounded-lg p-5 shadow-sm">
            <h3 className="font-semibold text-black mb-3 text-lg">
              Authentication
            </h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• JWT-based authentication</li>
              <li>• Password hashing dengan bcrypt</li>
              <li>• Role-based access control</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-300 rounded-lg p-5 shadow-sm">
            <h3 className="font-semibold text-black mb-3 text-lg">
              User Management
            </h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• CRUD operations</li>
              <li>• Role system (student, instructor, admin)</li>
              <li>• Profile management</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-300 rounded-lg p-5 shadow-sm">
            <h3 className="font-semibold text-black mb-3 text-lg">
              Course Management
            </h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Create, read, update, delete courses</li>
              <li>• Instructor ownership validation</li>
              <li>• Student enrollment tracking</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-300 rounded-lg p-5 shadow-sm">
            <h3 className="font-semibold text-black mb-3 text-lg">
              Modern Frontend
            </h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Next.js 16 with App Router</li>
              <li>• TypeScript for type safety</li>
              <li>• Tailwind CSS styling</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Documentation Links */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-black">
          Dokumentasi Lengkap
        </h2>
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
          <ul className="space-y-2 text-gray-700">
            <li>
              <span className="font-semibold text-black">README.md</span> -
              Setup lengkap, API endpoints, troubleshooting
            </li>
            <li>
              <span className="font-semibold text-black">
                backend/MVC_CONCEPT.ts
              </span>{" "}
              - Penjelasan detail MVC pattern
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
