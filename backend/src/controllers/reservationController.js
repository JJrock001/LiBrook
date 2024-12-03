// reservationController.js
import Reservation from '../models/Reservation.js';

const getReservations = async (req, res) => {
  try {
    const userId = req.params.userId;
    const reservations = await Reservation.find({ user: userId });  // Assuming `user` is a reference in Reservation model
    if (reservations.length === 0) {
      return res.status(404).json({ message: 'No reservations found for this user.' });
    }
    res.status(200).json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

export default { getReservations };
