// Backend: User Model (models/User.js)
import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		cnic: { type: Number, required: true, unique: true },
		role: { type: String, enum: ["user", "admin"], default: "user" },
		password: { type: String, required: true }, // Ensure password is required
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
