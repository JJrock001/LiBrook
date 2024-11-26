import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  room_name: {
    type: String,
    required: true,
  },
  room_type:{
    type: Number,
    required: true,
  },
  room_avl: {
    type: [Boolean],  
    required: true,
  },
});

const Room = mongoose.model("Room", roomSchema);

export default Room;
