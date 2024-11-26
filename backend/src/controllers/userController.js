
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