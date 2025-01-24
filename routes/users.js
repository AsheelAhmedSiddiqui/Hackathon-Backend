import express from "express";
import User from "../models/UserModel.js";

const router = express.Router();

router.get("/", async (req, res) => {
	const user = await User.find();
	res.json(user);
});

export default router;
