// reservationRoutes.js
import express from 'express';
import reservationController from '../controllers/reservationController.js';

const router = express.Router();

// Get reservations for a specific user
router.get('/:userId/reservations', reservationController.getReservations);

export default router;
