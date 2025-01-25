import express from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/UserModel.js";
import { check, validationResult } from "express-validator";
// import User from "../models/User.js";

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
// router.post(
// 	"/signup",
// 	[
// 	  check("name")
// 		.isLength({ min: 8, max: 40 })
// 		.withMessage("Name must be between 8 and 40 characters"),
// 	  check("email").isEmail().withMessage("Please provide a valid email"),
// 	  check("cnic")
// 		.isLength({ min: 13, max: 13 })
// 		.withMessage("CNIC must be exactly 13 digits")
// 		.isNumeric()
// 		.withMessage("CNIC must contain only numbers"),
// 	  check("password")
// 		.isLength({ min: 6 })
// 		.withMessage("Password must be at least 6 characters long"),
// 	],
// 	async (req, res) => {
// 	  const errors = validationResult(req);
// 	  if (!errors.isEmpty()) {
// 		return res.status(400).json({ errors: errors.array() });
// 	  }
  
// 	  const { name, email, cnic, role, password } = req.body;
  
// 	  try {
// 		// Hash the password
// 		const hashedPassword = await bcrypt.hash(password, 10);
  
// 		// Create new user
// 		const newUser = new User({
// 		  name,
// 		  email,
// 		  cnic,
// 		  role,
// 		  password: hashedPassword,
// 		});
  
// 		await newUser.save();
  
// 		const token = generateToken(newUser);
// 		res.cookie("token", token, { httpOnly: true });
  
// 		res.status(201).json({ msg: "User registered successfully", token });
// 	  } catch (error) {
// 		res
// 		  .status(500)
// 		  .json({ msg: "Error registering user", error: error.message });
// 	  }
// 	}
// );


router.post(
	"/signup",
	[
	  check("name")
		.isLength({ min: 8, max: 40 })
		.withMessage("Name must be between 8 and 40 characters"),
	  check("email").isEmail().withMessage("Please provide a valid email"),
	  check("cnic")
		.isLength({ min: 13, max: 13 })
		.withMessage("CNIC must be exactly 13 digits")
		.isNumeric()
		.withMessage("CNIC must contain only numbers"),
	],
	async (req, res) => {
	  const errors = validationResult(req);
	  if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	  }
  
	  const { name, email, cnic } = req.body;
  
	  try {
		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
		  return res.status(400).json({ msg: "User with this email already exists" });
		}
  
		// Generate a random password
		const generatedPassword = crypto.randomBytes(8).toString("hex"); // 16-character random password
  
		// Hash the generated password
		const hashedPassword = await bcrypt.hash(generatedPassword, 10);
  
		// Create new user
		const newUser = new User({
		  name,
		  email,
		  cnic,
		  password: hashedPassword,
		});
  
		await newUser.save();
  
		// Generate a token
		const token = generateToken(newUser);
  
		// Set token in HTTP-only cookie
		res.cookie("token", token, { httpOnly: true });
  
		// Send response with the generated password
		res.status(201).json({
		  msg: "User registered successfully",
		  token,
		  generatedPassword, // Send the password for the user to note down
		});
	  } catch (error) {
		res.status(500).json({ msg: "Error registering user", error: error.message });
	  }
	}
  );





  router.post(
	"/login",
	[
	  check("email").isEmail().withMessage("Please provide a valid email"),
	  check("password").notEmpty().withMessage("Password is required"),
	],
	async (req, res) => {
	  const errors = validationResult(req);
	  if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	  }
  
	  const { email, password } = req.body;
  
	  try {
		// Mock user check for demonstration
		const mockUser = {
		  email: "test@example.com",
		  password: "123456",
		  token: "mockToken123",
		};
  
		if (email === mockUser.email && password === mockUser.password) {
		  res.cookie("token", mockUser.token, { httpOnly: true });
		  return res.status(200).json({ msg: "Login successful", token: mockUser.token });
		}
  
		res.status(401).json({ msg: "Invalid email or password" });
	  } catch (error) {
		res.status(500).json({ msg: "Server error", error: error.message });
	  }
	}
  );
  

router.get("/profile", async (req, res) => {
	try {
		const authHeader = req.headers.authorization; // Get the Authorization header

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res
				.status(401)
				.json({ msg: "Authorization token missing or invalid" });
		}

		const token = authHeader.split(" ")[1]; // Extract the token part (after "Bearer ")
		// console.log('token in profile  ', token)
		// Verify the token (using JWT or your chosen library)
		// console.log('jwtseceret', process.env.JWT_SECRET)
		jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
			if (err) {
				console.log(err);
				return res.status(403).json({ msg: "Invalid or expired token" });
			}

			// Token is valid, proceed with the request
			req.user = user; // Attach the decoded user data to the request object
			const singleUser = await User.findOne({ email: user.email });
			// console.log('singe user', singleUser)
			// console.log('user in profile', user)
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

export default router;
