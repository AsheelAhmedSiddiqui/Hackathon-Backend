import express from "express";
import dotenv from "dotenv";
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

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
