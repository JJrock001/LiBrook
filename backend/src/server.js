// backend/src/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";  // Import dotenv to load .env file
import authRoutes from "./routes/authRoutes.js"; // Correct relative path
import reservationRoutes from "./routes/reservationRoutes.js"; // Correct relative path
import userRoutes from "./routes/userRoutes.js"; // Import userRoutes

dotenv.config();  // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3222;

// Middleware
app.use(cors({
  origin: "http://54.85.236.167:3221",  // Allow frontend on port 3221
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true // Allow credentials if using cookies
}));
app.use(express.json()); // Parse JSON body

// Routes
app.use("/api/auth", authRoutes);  // Auth routes for sign-up and login
app.use("/api/reservation", reservationRoutes);  // Reservation routes
app.use("/api/users", userRoutes); // Mount userRoutes

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);  // Exit the server if MongoDB connection fails
  });

// Error handling middleware
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

// Endpoint to check room availability
app.get('/api/reservation/check-availability', async (req, res) => {
  const { roomName, startTime, endTime } = req.query;
  console.log(`Checking availability for room: ${roomName}, start: ${startTime}, end: ${endTime}`);

  try {
    const start = parseInt(startTime);
    const end = parseInt(endTime);
    console.log(`Parsed times - start: ${start}, end: ${end}`);

    const reservation = await Reservation.findOne({
      roomName: roomName,
      startTime: { $lt: end },
      endTime: { $gt: start }
    });

    if (reservation) {
      return res.json({ isBooked: true });
    } else {
      return res.json({ isBooked: false });
    }
  } catch (error) {
    console.error('Error checking room availability:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
