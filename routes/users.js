import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/UserModel.js";
// import Student from "../model/Student.js";

const router = express.Router();

const generateToken = (user) => {
	return jwt.sign(
		{ id: user._id, email: user.email, role: user.role },
		process.env.JWT_SECRET,
		{
			expiresIn: "1h",
		}
	);
};

// Signup
router.post("/signup", async (req, res) => {
	const { name, email, cnic, password, role } = req.body;

	const existCnic = await User.findOne({ cnic });
	const existEmail = await User.findOne({ email });

	try {
		if (existCnic) {
			return res.status(401).json({ message: "CNIC already exist" });
		} else if (existEmail) {
			return res.status(402).json({ message: "Email is already exist" });
		} else {
			const hashedPassword = await bcrypt.hash(password, 10);
			const newUser = new User({
				name,
				email,
				cnic,
				password: hashedPassword,
				role,
			});
			await newUser.save();

			const token = generateToken(newUser);
			res.cookie("token", token, { httpOnly: true });

			res.status(201).json({ msg: "User registered successfully", token });
		}
	} catch (error) {
		res.status(500).json({ msg: "Something went wrong", error: error.message });
	}
});

// Login
router.post("/login", async (req, res) => {
	const { cnic, password } = req.body;

	try {
		const user = await User.findOne({ cnic });
		if (!user) return res.status(404).json({ msg: "User not found" });

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

		const token = generateToken(user);
		console.log("token", token);
		res.cookie("token", token, { httpOnly: true });

		res.status(200).json({
			msg: "Login successful",
			token,
			role: user.role,
			name: user.name,
			cnic: user.cnic,
		});
	} catch (error) {
		res.status(500).json({ msg: "Error logging in", error: error.message });
	}
});

router.get("/profile", async (req, res) => {
	try {
		// console.log("Cookies: ", req); // Debug cookies received

		// const token = req.cookies.token; // Check if token exists
		// if (!token) return res.status(401).json({ msg: "Unauthorized" });

		// const decoded = jwt.verify(token, "secretkey");
		// const user = await User.findById(decoded.id).select("-password");

		const authHeader = req.headers.authorization; // Get the Authorization header

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res
				.status(401)
				.json({ msg: "Authorization token missing or invalid" });
		}

		const token = authHeader.split(" ")[1]; // Extract the token part (after "Bearer ")
		console.log("token in profile  ", token);
		// Verify the token (using JWT or your chosen library)
		console.log("jwtseceret", process.env.JWT_SECRET);
		jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
			if (err) {
				console.log(err);
				return res.status(403).json({ msg: "Invalid or expired token" });
			}

			// Token is valid, proceed with the request
			req.user = user; // Attach the decoded user data to the request object
			const singleUser = await User.findOne({ email: user.email });
			console.log("singe user", singleUser);
			console.log("user in profile", user);
			res.status(200).json({ msg: "Token is valid", user: singleUser });
		});
	} catch (error) {
		console.error("Error: ", error.message);
		res
			.status(500)
			.json({ msg: "Error fetching user data", error: error.message });
	}
});

// GET route to fetch all users
router.get("/getAllUsers", async (req, res) => {
	try {
		const users = await User.find({}, "name email role");
		res.json(users);
	} catch (error) {
		console.error("Error fetching users:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

// // Modify the getAllUsers route
// router.get('/getAllUsers', async (req, res) => {
//     try {
//         const users = await User.find({}, 'name email role');
//         res.json(users);
//     } catch (error) {
//         console.error('Error fetching users:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

export default router;
