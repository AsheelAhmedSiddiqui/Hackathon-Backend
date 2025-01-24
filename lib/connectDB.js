import mongoose from "mongoose";

export async function connectDB() {
	try {
		let connection = mongoose.connect(process.env.MONGO_URI);
		console.info("MongoDB Connected");
	} catch (err) {
		console.log(err);
	}
}
