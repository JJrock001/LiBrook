// backend/src/routes/authRoutes.js
import express from "express";
import { createAccount, loginUser } from "../controllers/authController.js";
import verifyToken from '../middleware/authMiddleware.js';
import User from "../models/User.js"; // Import User model

const router = express.Router();

// Create Account Route
router.post("/create-account", createAccount);

// Login Route
router.post("/login", loginUser);

// Get User Data Route
router.get('/:userId', verifyToken, async (req, res) => {
  const { userId } = req.params;
  console.log("Requested User ID:", userId);
  console.log("Authenticated User ID:", req.userId);
  // If the userId in the request doesn't match the one in the token, reject
  if (req.userId !== userId) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const user = await User.findById(userId).populate('reservations');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "An error occurred while fetching user data." });
  }
});

export default router;
