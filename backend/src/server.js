// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js"; // Import auth routes
import reservationRoutes from "./routes/reservationRoutes.js"; // Import reservation routes

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3222; // Use port 3222

// Middleware
app.use(cors({
  origin: "http://localhost:3221",  // Allow frontend on port 3221
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json()); // Parse JSON body

// Routes
app.use("/api/auth", authRoutes);  // Auth routes for sign-up and login
app.use("/api/reservation", reservationRoutes);  // Reservation routes

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start server
app.listen(port, () => {
  console.log(`Server running on http://54.85.236.167:${port}`);
});
