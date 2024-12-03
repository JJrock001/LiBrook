import User from "../models/User.js";

// Function to add a booking to the user's history
const addBookingToHistory = async (userId, bookingDetails) => {
  try {
    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Add the new booking to the user's booking history
    user.bookingHistory.push({
      reservationDate: new Date(),
      details: bookingDetails,
    });

    // Save the updated user document
    await user.save();

    console.log("Booking added to history successfully");
  } catch (err) {
    console.error("Error adding booking to history:", err);
  }
};

const getUserBookingHistory = async (userId) => {
    try {
      // Find the user by their ID and populate their booking history
      const user = await User.findById(userId);
  
      if (!user) {
        throw new Error("User not found");
      }
  
      console.log("Booking History:", user.bookingHistory);
      return user.bookingHistory;
    } catch (err) {
      console.error("Error fetching booking history:", err);
    }
  };