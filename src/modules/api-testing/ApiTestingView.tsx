/**
 * API Testing Module
 * Interactive UI untuk testing API endpoints
 */

"use client";

import React, { useState } from "react";
import { useAuth } from "@/components/Contexts/AuthContext";
import Button from "@/components/Element/Button";
import Input from "@/components/Element/Input";
import Card from "@/components/Element/Card";
import { authAPI, userAPI, courseAPI, ApiError } from "@/utils/helpers/api";

interface TestResult {
  endpoint: string;
  method: string;
  status: "success" | "error";
  data?: unknown;
  error?: string;
  timestamp: string;
}

export default function ApiTestingView() {
  const { token, user } = useAuth();
  const [results, setResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to render test result data
  const renderResultData = (data: unknown): string => {
    if (typeof data === "object" && data !== null) {
      return JSON.stringify(data, null, 2);
    }
    return String(data);
  };

  // Auth Form States
  const [registerData, setRegisterData] = useState<{
    name: string;
    email: string;
    password: string;
    role: "student" | "instructor" | "admin";
  }>({
    name: "Test User",
    email: "test@example.com",
    password: "password123",
    role: "student",
  });

  const [loginData, setLoginData] = useState({
    email: "test@example.com",
    password: "password123",
  });

  // Course Form State
  const [courseData, setCourseData] = useState({
    title: "Test Course",
    description: "This is a test course",
    category: "Programming",
    level: "beginner" as const,
    price: 99000,
    duration: 120,
  });

  const addResult = (result: Omit<TestResult, "timestamp">) => {
    setResults((prev) => [
      {
        ...result,
        timestamp: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);
  };

  const testEndpoint = async (
    name: string,
    method: string,
    fn: () => Promise<unknown>
  ) => {
    setIsLoading(true);
    try {
      const response = await fn();
      addResult({
        endpoint: name,
        method,
        status: "success",
        data: response,
      });
    } catch (error) {
      const err = error as ApiError;
      addResult({
        endpoint: name,
        method,
        status: "error",
        error: err.message,
        data: err.data,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auth Tests
  const handleRegister = () =>
    testEndpoint("Register", "POST", () => authAPI.register(registerData));

  const handleLogin = () =>
    testEndpoint("Login", "POST", () => authAPI.login(loginData));

  const handleGetMe = () =>
    testEndpoint("Get Me", "GET", () => authAPI.getMe(token || ""));

  // User Tests
  const handleGetUsers = () =>
    testEndpoint("Get All Users", "GET", () =>
      userAPI.getAll(token || "", 1, 10)
    );

  // Course Tests
  const handleGetCourses = () =>
    testEndpoint("Get All Courses", "GET", () =>
      courseAPI.getAll({ page: 1, limit: 10 })
    );

  const handleCreateCourse = () =>
    testEndpoint("Create Course", "POST", () =>
      courseAPI.create(courseData, token || "")
    );

  const handleSearchCourses = () =>
    testEndpoint("Search Courses", "GET", () =>
      courseAPI.getAll({ search: "test", level: "beginner" })
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          API Testing Interface
        </h1>
        <Button variant="secondary" size="sm" onClick={() => setResults([])}>
          Clear Results
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Authentication Tests */}
        <Card title="🔐 Authentication">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Register</h4>
              <div className="space-y-2">
                <Input
                  placeholder="Name"
                  value={registerData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setRegisterData({ ...registerData, name: e.target.value })
                  }
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={registerData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setRegisterData({ ...registerData, email: e.target.value })
                  }
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={registerData.password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setRegisterData({
                      ...registerData,
                      password: e.target.value,
                    })
                  }
                />
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={registerData.role}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      role: e.target.value as
                        | "student"
                        | "instructor"
                        | "admin",
                    })
                  }
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleRegister}
                  isLoading={isLoading}
                >
                  Test Register
                </Button>
              </div>
            </div>

            <hr />

            <div>
              <h4 className="font-semibold mb-2">Login</h4>
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={loginData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                />
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleLogin}
                  isLoading={isLoading}
                >
                  Test Login
                </Button>
              </div>
            </div>

            <hr />

            <Button
              variant="success"
              className="w-full"
              onClick={handleGetMe}
              isLoading={isLoading}
              disabled={!token}
            >
              Test Get My Profile
            </Button>
          </div>
        </Card>

        {/* Course Tests */}
        <Card title="📚 Courses">
          <div className="space-y-4">
            <Button
              variant="primary"
              className="w-full"
              onClick={handleGetCourses}
              isLoading={isLoading}
            >
              Get All Courses
            </Button>

            <Button
              variant="primary"
              className="w-full"
              onClick={handleSearchCourses}
              isLoading={isLoading}
            >
              Search Courses (test, beginner)
            </Button>

            <hr />

            <div>
              <h4 className="font-semibold mb-2">Create Course</h4>
              <div className="space-y-2">
                <Input
                  placeholder="Title"
                  value={courseData.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCourseData({ ...courseData, title: e.target.value })
                  }
                />
                <Input
                  placeholder="Category"
                  value={courseData.category}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCourseData({ ...courseData, category: e.target.value })
                  }
                />
                <Input
                  type="number"
                  placeholder="Price"
                  value={courseData.price}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCourseData({
                      ...courseData,
                      price: Number(e.target.value),
                    })
                  }
                />
                <Button
                  variant="success"
                  className="w-full"
                  onClick={handleCreateCourse}
                  isLoading={isLoading}
                  disabled={!token || user?.role === "student"}
                >
                  Test Create Course (Instructor Only)
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* User Management Tests */}
        <Card title="👥 User Management">
          <div className="space-y-4">
            <Button
              variant="primary"
              className="w-full"
              onClick={handleGetUsers}
              isLoading={isLoading}
              disabled={!token || user?.role !== "admin"}
            >
              Get All Users (Admin Only)
            </Button>

            <p className="text-sm text-gray-500">
              {user?.role !== "admin"
                ? "Login sebagai admin untuk test endpoint ini"
                : "Klik button untuk test get users"}
            </p>
          </div>
        </Card>

        {/* Current Auth Info */}
        <Card title="ℹ️ Current Authentication">
          <div className="space-y-2">
            <div>
              <span className="font-semibold">Status:</span>{" "}
              <span className={token ? "text-green-600" : "text-red-600"}>
                {token ? "Authenticated" : "Not Authenticated"}
              </span>
            </div>
            {user && (
              <>
                <div>
                  <span className="font-semibold">User:</span> {user.name}
                </div>
                <div>
                  <span className="font-semibold">Email:</span> {user.email}
                </div>
                <div>
                  <span className="font-semibold">Role:</span>{" "}
                  <span className="capitalize">{user.role}</span>
                </div>
              </>
            )}
            {token && (
              <div className="mt-2">
                <span className="font-semibold">Token:</span>
                <p className="text-xs text-gray-600 mt-1 break-all">
                  {token.substring(0, 50)}...
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Results Section */}
      <Card title="📊 Test Results">
        {results.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Belum ada test yang dijalankan. Klik button di atas untuk test API.
          </p>
        ) : (
          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  result.status === "success"
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-semibold">{result.endpoint}</span>
                    <span className="ml-2 text-sm text-gray-600">
                      {result.method}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {result.timestamp}
                  </span>
                </div>

                {result.status === "success" ? (
                  <div className="mt-2">
                    <div className="text-sm text-green-700 font-semibold mb-1">
                      ✅ Success
                    </div>
                    <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-40">
                      {renderResultData(result.data)}
                    </pre>
                  </div>
                ) : (
                  <div className="mt-2">
                    <div className="text-sm text-red-700 font-semibold mb-1">
                      ❌ Error
                    </div>
                    <p className="text-sm text-red-600">{result.error}</p>
                    {result.data !== undefined && (
                      <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-40 mt-2">
                        {renderResultData(result.data)}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
