/**
 * DATABASE CONFIGURATION
 * File ini mengatur koneksi ke MongoDB menggunakan Mongoose
 */

import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/collablearn";

    await mongoose.connect(mongoURI);

    console.log("✅ MongoDB Connected Successfully");
    console.log(`📊 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1); // Keluar dari aplikasi jika gagal koneksi
  }
};

// Event listeners untuk monitoring koneksi
mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB Disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB Error:", err);
});

export default connectDB;
