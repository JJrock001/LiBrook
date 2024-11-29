import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";  // Import User model

const router = express.Router();

// In authRoutes.js
// Create Account Route
router.post("/create-account", async (req, res) => {
    const { username, email, password, confirm_password } = req.body;

    // Validate input fields
    if (!username || !email || !password || !confirm_password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirm_password) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save(); // Save the new user to the database

        res.status(201).json({ message: "Account created successfully!" });
    } catch (err) {
        console.error("Error during account creation:", err);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});

// Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        console.log("Looking for user with email:", email);
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found:", email);
            return res.status(400).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log("Invalid password for user:", email);
            return res.status(400).json({ message: "Invalid password" });
        }

        console.log("Password valid, generating JWT...");
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log("Token generated:", token);
        res.json({ token });

    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
});


export default router;
