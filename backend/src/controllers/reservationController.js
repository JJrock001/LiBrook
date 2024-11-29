import Reservation from "../models/Reservation.js";

// Create reservation
export const createReservation = async (req, res) => {
  const { userId, roomType, startTime, endTime } = req.body;

  try {
    // Check if time slot is available (this could be expanded)
    const existingReservation = await Reservation.findOne({ roomType, startTime, endTime });
    if (existingReservation) {
      return res.status(400).json({ message: "Room is already reserved for this time" });
    }

    const reservation = new Reservation({
      user: userId,
      roomType,
      startTime,
      endTime,
    });

    await reservation.save();
    res.status(201).json({ message: "Reservation made successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
