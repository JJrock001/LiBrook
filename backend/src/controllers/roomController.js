import Room from "../models/roomModel.js";

const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const bookRoom = async (req, res) => {
  const { roomId, index } = req.body;

  try {
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (!room.room_avl[index]) {
      return res.status(400).json({ message: "Selected room time slot is unavailable" });
    }

    // Mark the time slot as booked
    room.room_avl[index] = false;
    await room.save();

    res.status(200).json({ message: "Room booked successfully", room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getRooms, bookRoom };
