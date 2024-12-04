// backend/src/routes/reservationRoutes.js
import express from 'express';
import Reservation from '../models/Reservation.js';
import User from '../models/User.js';
import verifyToken from '../middleware/authMiddleware.js'; // Import verifyToken

const router = express.Router();

// Existing GET /user/:userId route
router.get('/user/:userId', verifyToken, async (req, res) => {
    const { userId } = req.params;

    // Ensure the requester is accessing their own data
    if (req.userId !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    try {
      const reservations = await Reservation.find({ user: userId });
      if (reservations.length === 0) {
        return res.status(404).json({ message: 'No reservations found for this user.' });
      }
      res.status(200).json(reservations);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  });

// Existing GET /check-availability route
router.get('/check-availability', async (req, res) => {
    const { roomName, startTime, endTime } = req.query;

    try {
        const start = parseInt(startTime);
        const end = parseInt(endTime);

        const reservations = await Reservation.find({
            roomName: roomName,
            startTime: { $lt: end },
            endTime: { $gt: start }
        });

        const bookedSlots = reservations.map(reservation => ({
            startTime: reservation.startTime,
            endTime: reservation.endTime,
        }));

        res.json({ bookedSlots });
    } catch (error) {
        console.error('Error checking room availability:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// **Add This POST Route**
// POST /api/reservation/reservations
router.post('/reservations', verifyToken, async (req, res) => {
    const { startTime, endTime, roomName, roomType } = req.body;

    // Input validation
    if (!startTime || !endTime || !roomName || !roomType) {
        return res.status(400).json({ message: "All fields (startTime, endTime, roomName, roomType) are required." });
    }

    if (startTime >= endTime) {
        return res.status(400).json({ message: "startTime must be earlier than endTime." });
    }

    try {
        // Check if the room is available (redundant if frontend already checks, but good for safety)
        const overlappingReservations = await Reservation.findOne({
            roomName: roomName,
            startTime: { $lt: endTime },
            endTime: { $gt: startTime }
        });

        if (overlappingReservations) {
            return res.status(409).json({ message: "The selected time slot is already booked." });
        }

        // Create new reservation
        const newReservation = new Reservation({
            user: req.userId, // Extracted from verifyToken middleware
            roomName: roomName,
            roomType: roomType,
            startTime: startTime,
            endTime: endTime,
            status: "Confirmed", // Default status
        });

        const savedReservation = await newReservation.save();

        // Link reservation to user
        await User.findByIdAndUpdate(req.userId, { $push: { reservations: savedReservation._id } });

        res.status(201).json({
            message: "Reservation created successfully.",
            reservation: savedReservation
        });
    } catch (error) {
        console.error("Error creating reservation:", error);
        res.status(500).json({ message: "An error occurred while creating the reservation." });
    }
});

export default router;
