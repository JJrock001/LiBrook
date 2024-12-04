// backend/src/controllers/reservationController.js
import Reservation from '../models/Reservation.js';
import User from '../models/User.js';

export const createReservation = async (req, res) => {
    const { userId, roomName, roomType, startTime, endTime } = req.body;

    // Basic validation
    if (!userId || !roomName || !roomType || !startTime || !endTime) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Create new reservation
        const newReservation = new Reservation({
            user: userId,
            roomName,
            roomType,
            startTime,
            endTime,
            status: "Confirmed", // Default status
        });

        const savedReservation = await newReservation.save();

        // Link reservation to user
        user.reservations.push(savedReservation._id);
        await user.save();

        res.status(201).json(savedReservation);
    } catch (error) {
        console.error("Error creating reservation:", error);
        res.status(500).json({ message: "An error occurred while creating the reservation." });
    }
};
