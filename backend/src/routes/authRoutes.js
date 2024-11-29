import express from 'express';  // Make sure this line is at the top

import { createAccount, login } from "../controllers/authController.js"; // Import controller functions

const router = express.Router();

// Define routes for user authentication
router.post("/create-account", createAccount);
router.post("/login", login);  // Add the login route

export default router;
