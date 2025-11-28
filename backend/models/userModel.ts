/**
 * USER MODEL (Data Layer)
 * Mendefinisikan struktur data User di database
 * Schema ini menentukan field apa saja yang harus ada dan tipe datanya
 */

import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

// Interface untuk TypeScript (Type Safety)
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "student" | "instructor" | "admin";
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Schema MongoDB
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Nama harus diisi"],
      trim: true,
      minlength: [3, "Nama minimal 3 karakter"],
    },
    email: {
      type: String,
      required: [true, "Email harus diisi"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Format email tidak valid"],
    },
    password: {
      type: String,
      required: [true, "Password harus diisi"],
      minlength: [6, "Password minimal 6 karakter"],
      select: false, // Password tidak akan muncul saat query by default
    },
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },
  },
  {
    timestamps: true, // Otomatis menambahkan createdAt dan updatedAt
  }
);

// Middleware: Hash password sebelum disimpan
userSchema.pre("save", async function () {
  // Hanya hash jika password baru dimodifikasi
  if (!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

// Method: Membandingkan password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
