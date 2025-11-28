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
          Konsep MVC (Model-View-Controller)
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
                Mengatur database, schema, validasi data
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

        {/* Request Flow */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6 shadow-sm">
          <h3 className="text-2xl font-semibold mb-4 text-black">
            Alur Data (Request Flow)
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
  • Panggil Model untuk query DB
  • Process data
    ↓
MODEL (models/courseModel.ts)
  • Define schema
  • Query ke MongoDB
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
            Struktur Folder MVC
          </h3>
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <pre className="text-sm text-black whitespace-pre-wrap">
              {`backend/
├── config/              Konfigurasi
│   └── database.ts     → MongoDB connection
│
├── models/             MODEL (Data Layer)
│   ├── userModel.ts    → Schema User
│   └── courseModel.ts  → Schema Course
│
├── controllers/        CONTROLLER (Logic)
│   ├── authController.ts
│   ├── userController.ts
│   └── courseController.ts
│
├── routes/             ROUTES (Endpoints)
│   ├── authRoutes.ts
│   ├── userRoutes.ts
│   └── courseRoutes.ts
│
├── middleware/         Middleware
│   ├── auth.ts         → JWT authentication
│   └── errorHandler.ts → Global error handling
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
                  <br />→ Route mengarahkan ke controller function &quot;login&quot;
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
            <li>MongoDB (local atau MongoDB Atlas)</li>
            <li>npm atau yarn</li>
          </ul>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-6 mb-4 shadow-sm">
          <h3 className="text-xl font-semibold mb-3 text-black">
            1. Install Dependencies
          </h3>
          <div className="bg-gray-900 text-gray-100 p-4 rounded">
            <code>npm install</code>
          </div>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-6 mb-4 shadow-sm">
          <h3 className="text-xl font-semibold mb-3 text-black">
            2. Setup Environment (.env.local)
          </h3>
          <div className="bg-gray-900 text-gray-100 p-4 rounded">
            <pre className="text-sm">
              {`MONGODB_URI=mongodb://localhost:27017/collablearn
JWT_SECRET=your_jwt_secret_here
PORT=3001
FRONTEND_URL=http://localhost:3000`}
            </pre>
          </div>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-3 text-black">
            3. Run Servers
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
            <li>
              <span className="font-semibold text-black">
                tests/API_DOCUMENTATION.md
              </span>{" "}
              - Reference semua endpoints
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
