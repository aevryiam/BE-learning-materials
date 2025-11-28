/**
 * COURSE MODEL (Data Layer)
 * Mendefinisikan struktur data Course untuk platform learning
 */

import mongoose, { Document, Schema } from "mongoose";

export interface ICourse extends Document {
  title: string;
  description: string;
  instructor: mongoose.Types.ObjectId; // Relasi ke User
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  price: number;
  duration: number; // dalam menit
  thumbnail?: string;
  isPublished: boolean;
  enrolledStudents: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: [true, "Judul course harus diisi"],
      trim: true,
      maxlength: [100, "Judul maksimal 100 karakter"],
    },
    description: {
      type: String,
      required: [true, "Deskripsi harus diisi"],
      maxlength: [2000, "Deskripsi maksimal 2000 karakter"],
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User", // Relasi ke model User
      required: true,
    },
    category: {
      type: String,
      required: [true, "Kategori harus diisi"],
      trim: true,
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    price: {
      type: Number,
      required: [true, "Harga harus diisi"],
      min: [0, "Harga tidak boleh negatif"],
    },
    duration: {
      type: Number,
      required: [true, "Durasi harus diisi"],
      min: [1, "Durasi minimal 1 menit"],
    },
    thumbnail: {
      type: String,
      default: "",
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    enrolledStudents: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index untuk pencarian yang lebih cepat
courseSchema.index({ title: "text", description: "text" });
courseSchema.index({ category: 1 });
courseSchema.index({ level: 1 });

const Course = mongoose.model<ICourse>("Course", courseSchema);

export default Course;
