// backend/src/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";  // Import dotenv to load .env file
import authRoutes from "./routes/authRoutes.js"; // Correct relative path
import reservationRoutes from "./routes/reservationRoutes.js"; // Correct relative path

dotenv.config();  // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3222;

// Middleware
app.use(cors({
  origin: "http://54.85.236.167:3221",  // Allow frontend on port 3221
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json()); // Parse JSON body

// Routes
app.use("/api/auth", authRoutes);  // Auth routes for sign-up and login
app.use("/api/reservation", reservationRoutes);  // Reservation routes

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);  // Exit the server if MongoDB connection fails
  });

// Error handling middleware (optional)
app.use((req, res, next) => {
  res.status(404).json({ message: "Resource not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://54.85.236.167:${port}`);
});
