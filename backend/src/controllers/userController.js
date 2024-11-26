
import User from "../models/userModel";

export const createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();

    res.status(200).json({ message: "OK" });
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).json({ error: "Bad Request" });
    } else {
      res.status(500).json({ error: "Internal server error." });
    }
  }
};

export const getUsers = async (req, res) => {
  const users = await User.find();

  res.status(200).json(users);
};

export const deleteUser = async (req, res) => {
  const { id } = req.params; // Get the item ID from the request parameters
  const index = users.findIndex(user => user._id === parseInt(id)); // Find the index of the item

  if (index !== -1) {
    users.splice(index, 1); // Remove the item from the array
    res.status(200).json({ message: "Item deleted successfully" }); // Success response
  } else {
    res.status(404).json({ error: "Item not found" }); // Error if the item is not found
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && user.password === password) {
      user.isLogin = true;
      await user.save();
      res.status(200).json({ message: "Login successful", user });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logoutUser = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);

    if (user) {
      user.isLogin = false;
      await user.save();
      res.status(200).json({ message: "Logout successful" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ username, password, isLogin: false });
    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { loginUser, logoutUser, registerUser };
