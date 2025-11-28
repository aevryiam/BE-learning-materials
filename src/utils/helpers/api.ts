/**
 * API Helper - Fetch Backend
 * Utility untuk handle HTTP requests ke backend API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
  token?: string;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ApiError";
  }
}

/**
 * Main fetch function untuk communicate dengan backend
 */
export async function fetchAPI<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = "GET", headers = {}, body, token } = options;

  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  if (body && method !== "GET") {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.message || "Request failed",
        response.status,
        data
      );
    }

    return data as ApiResponse<T>;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network error atau error lainnya
    throw new ApiError(
      error instanceof Error ? error.message : "Network error",
      0
    );
  }
}

// ========== AUTH API ==========

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: "student" | "instructor" | "admin";
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  user: UserData;
  token: string;
}

export const authAPI = {
  register: (data: RegisterData) =>
    fetchAPI<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: data,
    }),

  login: (data: LoginData) =>
    fetchAPI<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: data,
    }),

  getMe: (token: string) =>
    fetchAPI<UserData>("/api/auth/me", {
      token,
    }),
};

// ========== USER API ==========

export const userAPI = {
  getAll: (token: string, page = 1, limit = 10) =>
    fetchAPI(`/api/users?page=${page}&limit=${limit}`, {
      token,
    }),

  getById: (id: string, token: string) =>
    fetchAPI(`/api/users/${id}`, {
      token,
    }),

  update: (id: string, data: Partial<UserData>, token: string) =>
    fetchAPI(`/api/users/${id}`, {
      method: "PUT",
      body: data,
      token,
    }),

  delete: (id: string, token: string) =>
    fetchAPI(`/api/users/${id}`, {
      method: "DELETE",
      token,
    }),
};

// ========== COURSE API ==========

export interface CourseData {
  _id?: string;
  title: string;
  description: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  price: number;
  duration: number;
  instructor?: {
    _id: string;
    name: string;
    email: string;
  };
  isPublished?: boolean;
  enrolledStudents?: string[];
  createdAt?: string;
}

export const courseAPI = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    level?: string;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.category) queryParams.append("category", params.category);
    if (params?.level) queryParams.append("level", params.level);
    if (params?.search) queryParams.append("search", params.search);

    const queryString = queryParams.toString();
    return fetchAPI<CourseData[]>(
      `/api/courses${queryString ? `?${queryString}` : ""}`
    );
  },

  getById: (id: string) => fetchAPI<CourseData>(`/api/courses/${id}`),

  create: (data: Omit<CourseData, "_id" | "instructor">, token: string) =>
    fetchAPI<CourseData>("/api/courses", {
      method: "POST",
      body: data,
      token,
    }),

  update: (id: string, data: Partial<CourseData>, token: string) =>
    fetchAPI<CourseData>(`/api/courses/${id}`, {
      method: "PUT",
      body: data,
      token,
    }),

  delete: (id: string, token: string) =>
    fetchAPI(`/api/courses/${id}`, {
      method: "DELETE",
      token,
    }),
};

export default fetchAPI;
