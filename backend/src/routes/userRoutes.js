// backend/src/routes/userRoutes.js
import express from 'express';
import User from '../models/User.js';  // Import the User model
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

// Example: Update User Profile
router.put('/:userId', verifyToken, async (req, res) => {
  const { userId } = req.params;

  // If the userId in the request doesn't match the one in the token, reject
  if (req.userId !== userId) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true }).populate('reservations');
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).json({ message: "An error occurred while updating user data." });
  }
});

export default router;
