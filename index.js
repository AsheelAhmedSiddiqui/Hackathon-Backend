import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./lib/connectDB.js";
import usersRoutes from "./routes/users.js";

const app = express();
const port = 3010;
dotenv.config({ path: ".env.local" });

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
	res.send("Hello World!");
});

// all routes
app.use("/users", usersRoutes);

app.use(
	cors({
		origin: [
			"http://localhost:5173", // Allow localhost for development
			"https://smit-hakhaton-frontend.vercel.app", // Allow Vercel URL for production
		], // Allow these specific frontend addresses
		methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
		allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
		credentials: true, // Allows cookies to be sent
	})
);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
