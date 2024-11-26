import express from "express";
import mongoose from "mongoose";
import User from "./userModel.js"; // Import the User model

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// POST endpoint for login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user in the database
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid username" });
    }

    // Compare the password (you may want to hash passwords in production)
    if (user.password === password) {
      // Mark the user as logged in (optional)
      user.isLogin = true;
      await user.save();

      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Connect to MongoDB (adjust the connection string as needed)
mongoose.connect("mongodb://localhost:27017/yourdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => console.error("Error connecting to MongoDB:", error));
