import mongoose from "mongoose";

// TODO4: create the member model
// HINT: you can see and understand how to create model in ./itemModel.js
const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isLogin: {
      type: Boolean,
      required: true,
    },
    user_time: {
        type: Map,
        of:String,
    },

  });
  
  const User = mongoose.model("User", userSchema);
  
  export default User;