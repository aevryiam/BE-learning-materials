/**
 * KONSEP MVC (Model - View - Controller)
 * Dokumentasi pembelajaran untuk memahami arsitektur backend
 */

/*
=====================================
🏗️ APA ITU MVC?
=====================================

MVC adalah pola arsitektur yang memisahkan aplikasi menjadi 3 komponen utama:

1. MODEL (Data Layer)
   └─ Mengatur database, schema, validasi data
   
2. VIEW (Presentation Layer)  
   └─ Dalam REST API, VIEW = JSON Response ke Frontend
   
3. CONTROLLER (Logic Layer)
   └─ Otak aplikasi, memproses request, memanggil model, kirim response


=====================================
📊 ALUR DATA (REQUEST FLOW)
=====================================

Client (Browser/Frontend)
    ↓
    📨 HTTP Request: GET /api/courses
    ↓
┌─────────────────────────────────────┐
│  ROUTE (routes/courseRoutes.ts)     │
│  • Menerima request                 │
│  • Memanggil controller function    │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  CONTROLLER (controllers/           │
│  courseController.ts)               │
│  • Validasi input                   │
│  • Panggil Model untuk query DB     │
│  • Process data                     │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  MODEL (models/courseModel.ts)      │
│  • Define schema                    │
│  • Query ke MongoDB                 │
│  • Return data ke Controller        │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  CONTROLLER                         │
│  • Terima data dari Model           │
│  • Format response                  │
└─────────────────────────────────────┘
    ↓
    📤 JSON Response
    ↓
Client (Frontend)


=====================================
📁 STRUKTUR FOLDER MVC
=====================================

backend/
├── config/              ⚙️ Konfigurasi
│   └── database.ts     → MongoDB connection
│
├── models/             📊 MODEL (Data Layer)
│   ├── userModel.ts    → Schema User
│   └── courseModel.ts  → Schema Course
│
├── controllers/        🧠 CONTROLLER (Logic)
│   ├── authController.ts
│   ├── userController.ts
│   └── courseController.ts
│
├── routes/             🛣️ ROUTES (Endpoints)
│   ├── authRoutes.ts
│   ├── userRoutes.ts
│   └── courseRoutes.ts
│
├── middleware/         🛡️ Middleware
│   ├── auth.ts         → JWT authentication
│   └── errorHandler.ts → Global error handling
│
└── server.ts           🚀 Entry Point


=====================================
🔍 CONTOH KONKRET: LOGIN USER
=====================================

1️⃣ CLIENT KIRIM REQUEST
   POST http://localhost:3001/api/auth/login
   Body: { "email": "user@test.com", "password": "123456" }

2️⃣ ROUTE TERIMA REQUEST (routes/authRoutes.ts)
   router.post('/login', login);
   └─ Route mengarahkan ke controller function "login"

3️⃣ CONTROLLER PROCESS (controllers/authController.ts)
   export const login = async (req, res) => {
     // Ambil email & password dari request body
     const { email, password } = req.body;
     
     // Validasi input
     if (!email || !password) {
       return res.status(400).json({ message: "Email dan password harus diisi" });
     }
     
     // Panggil MODEL untuk cari user
     const user = await User.findOne({ email }).select('+password');
     
     if (!user) {
       return res.status(401).json({ message: "Email salah" });
     }
     
     // Cek password (method dari Model)
     const isValid = await user.comparePassword(password);
     
     if (!isValid) {
       return res.status(401).json({ message: "Password salah" });
     }
     
     // Generate JWT token
     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
     
     // KIRIM RESPONSE (VIEW)
     res.status(200).json({
       success: true,
       data: { user, token }
     });
   }

4️⃣ MODEL HANDLE DATABASE (models/userModel.ts)
   • Schema mendefinisikan struktur data
   • Method comparePassword untuk cek password
   • Middleware untuk hash password sebelum save

5️⃣ RESPONSE KE CLIENT
   {
     "success": true,
     "data": {
       "user": { "id": "...", "name": "...", "email": "..." },
       "token": "eyJhbGciOiJIUzI1..."
     }
   }


=====================================
💡 KENAPA HARUS PAKAI MVC?
=====================================

❌ TANPA MVC (Code campur aduk):
   server.ts
   ├─ Handle request
   ├─ Validasi input
   ├─ Query database
   ├─ Hash password
   ├─ Generate token
   └─ Send response
   
   → Code jadi BERANTAKAN
   → Susah maintenance
   → Sulit testing

✅ DENGAN MVC (Terpisah rapi):
   • MODEL    → Urusan database saja
   • CONTROLLER → Urusan logika bisnis saja
   • ROUTE    → Urusan endpoint saja
   
   → Code TERORGANISIR
   → Mudah maintenance
   → Gampang testing
   → Team bisa kerja parallel


=====================================
🎯 BEST PRACTICES
=====================================

1. SEPARATION OF CONCERNS
   ✅ Model fokus ke database schema & validasi
   ✅ Controller fokus ke business logic
   ✅ Route fokus ke endpoint mapping
   ✅ Middleware fokus ke authentication, validation, dll

2. FAT MODEL, THIN CONTROLLER
   ✅ Taruh logic sebanyak mungkin di Model
   ✅ Controller cuma orchestrate (koordinasi)
   
   Contoh:
   // ❌ JANGAN di Controller
   const hashedPassword = await bcrypt.hash(password, 10);
   
   // ✅ TARUH di Model (pre-save middleware)
   userSchema.pre('save', async function() {
     this.password = await bcrypt.hash(this.password, 10);
   });

3. CONSISTENT NAMING
   ✅ Model: userModel.ts, courseModel.ts
   ✅ Controller: userController.ts, courseController.ts
   ✅ Route: userRoutes.ts, courseRoutes.ts

4. STANDARD RESPONSE FORMAT
   ✅ Success:
   {
     "success": true,
     "message": "...",
     "data": { ... }
   }
   
   ✅ Error:
   {
     "success": false,
     "message": "...",
     "error": "..."
   }


=====================================
🚀 LATIHAN PEMAHAMAN
=====================================

TASK: Buat fitur "Get All Users"

1. Buat ROUTE di routes/userRoutes.ts
   router.get('/', getUsers);

2. Buat CONTROLLER di controllers/userController.ts
   export const getUsers = async (req, res) => {
     // Query ke Model
     const users = await User.find();
     
     // Send response
     res.json({ success: true, data: users });
   }

3. MODEL sudah ada (models/userModel.ts)
   User.find() → Query built-in dari Mongoose

4. Test dengan Postman:
   GET http://localhost:3001/api/users


=====================================
📚 NEXT LEVEL
=====================================

Setelah paham MVC basic, pelajari:
1. Middleware (auth, validation, error handling)
2. Relationships (User -> Courses, Course -> Lessons)
3. Pagination & Filtering
4. File Upload
5. Testing (Unit test, Integration test)
6. Deployment (PM2, Docker, VPS)

*/

export {};
