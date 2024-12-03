// backend/src/controllers/authController.js

import User from "../models/User.js";  // Assuming you have a User model
import bcrypt from "bcryptjs";

export const createAccount = async (req, res) => {
  const { username, email, password, confirm_password } = req.body;

  if (password !== confirm_password) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "Account created successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error, please try again" });
  }
};

// backend/src/controllers/authController.js

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

      // Return token and user data
      res.json({
          token,
          user: {
              id: user._id,
              name: user.username,  // Assuming 'username' is the name field in User model
              email: user.email,
              phone: user.phone,
              //profileImage: user.profileImage,  // Add this if your user model has it
              memberSince: user.createdAt,  // Assuming 'createdAt' is when the user joined
          }
      });

  } catch (err) {
      console.error("Error during login:", err);
      res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
});
