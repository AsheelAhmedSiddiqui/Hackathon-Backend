// Backend: User Model (models/User.js)
import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	cnic: { type: String, unique: true, required: true },
	role: { type: String, required: true },
	password: { type: String, required: true }, // Ensure password is required
  });

const User = mongoose.model("User", userSchema);
export default User;
