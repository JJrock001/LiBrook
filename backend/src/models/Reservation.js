// backend/src/models/reservation.js

import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    roomName: { type: String, required: true },
    roomType: { type: String, required: true },
    startTime: { type: Number, required: true }, // Unix timestamp in milliseconds
    endTime: { type: Number, required: true },   // Unix timestamp in milliseconds
    status: { type: String, default: "Confirmed" }, // e.g., Confirmed, Cancelled
});

const Reservation = mongoose.model('Reservation', reservationSchema);
export default Reservation;
