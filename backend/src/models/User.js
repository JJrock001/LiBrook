import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Ensure unique emails
  password: { type: String, required: true },
  reservations: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' } // Link to reservations
  ],
  profileImage: { type: String }, // Optional field for profile image URL or path
  createdAt: { type: Date, default: Date.now }, // Automatically set creation date
});

const User = mongoose.model('User', userSchema);
export default User;
