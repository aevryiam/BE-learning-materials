# API Testing - CollabLearn Backend

## Base URL

```
http://localhost:3001
```

## 🔐 Authentication Endpoints

### 1. Register User

**POST** `/api/auth/register`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student" // Optional: student | instructor | admin
}
```

**Response Success (201):**

```json
{
  "success": true,
  "message": "User berhasil didaftarkan",
  "data": {
    "user": {
      "id": "655abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2. Login

**POST** `/api/auth/login`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": "655abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 3. Get Current User Profile

**GET** `/api/auth/me`

**Headers:**

```
Authorization: Bearer <your_token_here>
```

**Response Success (200):**

```json
{
  "success": true,
  "data": {
    "id": "655abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

---

## 👥 User Management Endpoints (Admin Only)

### 4. Get All Users

**GET** `/api/users?page=1&limit=10`

**Headers:**

```
Authorization: Bearer <admin_token>
```

**Response Success (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "655abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

---

### 5. Get User By ID

**GET** `/api/users/:id`

**Headers:**

```
Authorization: Bearer <admin_token>
```

---

### 6. Update User

**PUT** `/api/users/:id`

**Headers:**

```
Authorization: Bearer <admin_token>
```

**Request Body:**

```json
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "role": "instructor"
}
```

---

### 7. Delete User

**DELETE** `/api/users/:id`

**Headers:**

```
Authorization: Bearer <admin_token>
```

---

## 📚 Course Endpoints

### 8. Get All Courses (Public)

**GET** `/api/courses?page=1&limit=10&category=programming&level=beginner&search=javascript`

**Query Parameters:**

- `page`: Nomor halaman (default: 1)
- `limit`: Jumlah data per halaman (default: 10)
- `category`: Filter by category
- `level`: beginner | intermediate | advanced
- `search`: Text search di title dan description

**Response Success (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "655abc123...",
      "title": "Mastering JavaScript",
      "description": "Learn JavaScript from scratch",
      "instructor": {
        "_id": "655xyz789...",
        "name": "Jane Instructor",
        "email": "jane@example.com"
      },
      "category": "programming",
      "level": "beginner",
      "price": 299000,
      "duration": 1200,
      "isPublished": true,
      "enrolledStudents": ["user_id_1", "user_id_2"],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

---

### 9. Get Single Course (Public)

**GET** `/api/courses/:id`

---

### 10. Create Course (Instructor Only)

**POST** `/api/courses`

**Headers:**

```
Authorization: Bearer <instructor_token>
```

**Request Body:**

```json
{
  "title": "Mastering JavaScript",
  "description": "Learn JavaScript from scratch to advanced level",
  "category": "programming",
  "level": "beginner",
  "price": 299000,
  "duration": 1200
}
```

**Response Success (201):**

```json
{
  "success": true,
  "message": "Course berhasil dibuat",
  "data": {
    "_id": "655abc123...",
    "title": "Mastering JavaScript",
    "instructor": "655xyz789...",
    "isPublished": false,
    "enrolledStudents": []
  }
}
```

---

### 11. Update Course (Instructor - Owner Only)

**PUT** `/api/courses/:id`

**Headers:**

```
Authorization: Bearer <instructor_token>
```

**Request Body:**

```json
{
  "title": "Updated Title",
  "price": 349000,
  "isPublished": true
}
```

---

### 12. Delete Course (Instructor - Owner Only)

**DELETE** `/api/courses/:id`

**Headers:**

```
Authorization: Bearer <instructor_token>
```

---

## 🧪 Testing Flow

### Scenario 1: Register & Login

1. Register sebagai student
2. Login dengan kredensial yang sama
3. Simpan token yang didapat
4. Test endpoint `/api/auth/me` dengan token

### Scenario 2: Create Course

1. Register/Login sebagai instructor
2. Create course dengan token instructor
3. Verify course muncul di GET `/api/courses`

### Scenario 3: Admin Access

1. Register/Login sebagai admin (ubah role di database manual jika perlu)
2. Test GET `/api/users` dengan admin token
3. Test update user lain

---

## 📝 Error Responses

**400 Bad Request:**

```json
{
  "success": false,
  "message": "Semua field harus diisi (name, email, password)"
}
```

**401 Unauthorized:**

```json
{
  "success": false,
  "message": "Token tidak valid atau expired"
}
```

**403 Forbidden:**

```json
{
  "success": false,
  "message": "Role 'student' tidak memiliki akses ke resource ini"
}
```

**404 Not Found:**

```json
{
  "success": false,
  "message": "Course tidak ditemukan"
}
```

**500 Internal Server Error:**

```json
{
  "success": false,
  "message": "Terjadi kesalahan saat membuat course",
  "error": "Detailed error message"
}
```
