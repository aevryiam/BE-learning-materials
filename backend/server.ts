/**
 * EXPRESS SERVER (Entry Point - Supabase Version)
 * File utama untuk menjalankan Express.js server dengan Supabase
 *
 * ALUR REQUEST:
 * 1. Client mengirim request -> Express menerima di routes
 * 2. Routes memanggil Controller yang sesuai
 * 3. Controller memproses logika dan query ke Model (Supabase Database)
 * 4. Model mengembalikan data ke Controller
 * 5. Controller mengirim response (JSON) kembali ke Client
 */

import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler";

// Import Routes
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import courseRoutes from "./routes/courseRoutes";

// Import Supabase config to initialize connection
import "./config/supabase";

// Load environment variables
dotenv.config({ path: ".env.local" });

// Initialize Express App
const app: Express = express();
const PORT = process.env.PORT || 3001;

// Validate Supabase credentials
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ ERROR: Supabase credentials missing!");
  console.error(
    "Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

// ========== MIDDLEWARE ==========

// CORS - Mengizinkan Frontend mengakses API
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Body Parser - Membaca data JSON dari request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger Middleware (opsional, untuk development)
app.use((req: Request, res: Response, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// ========== ROUTES ==========

// Health Check Endpoint
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "🚀 CollabLearn Backend API is running!",
    database: "Supabase PostgreSQL",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes); // Auth endpoints (register, login)
app.use("/api/users", userRoutes); // User CRUD endpoints
app.use("/api/courses", courseRoutes); // Course CRUD endpoints

// 404 Handler - Route tidak ditemukan
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} tidak ditemukan`,
  });
});

// Global Error Handler
app.use(errorHandler);

// ========== START SERVER ==========

app.listen(PORT, () => {
  console.log("=================================");
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🗄️  Database: Supabase (PostgreSQL)`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("=================================");
});

export default app;
