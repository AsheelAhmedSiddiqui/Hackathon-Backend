import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./lib/connectDB.js";
import usersRoutes from "./routes/users.js";
import categoriesRoutes from "./routes/categories.js";
import subcategoriesRoutes from "./routes/subcategories.js";

const app = express();
const port = 3010;
dotenv.config({ path: ".env.local" });

app.use(express.json());

app.use(
	cors({
		origin: [
			"http://localhost:5173",
			"https://hackathon-backend-production-2663.up.railway.app/",
			"https://hackathon-frontend-ia0xs5gk9-asheelahmedsiddiquis-projects.vercel.app",
		],
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true, // Required for cookies
	})
);

connectDB();

app.get("/", (req, res) => {
	res.send("Hello World!");
});

// all routes
app.use("/users", usersRoutes);
app.use("/categories", categoriesRoutes);
app.use("/subcategories", subcategoriesRoutes);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
