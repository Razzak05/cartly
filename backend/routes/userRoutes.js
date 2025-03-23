import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import generateToken from "../util/generateToken.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

//@route POST /api/users/register
//@desc Register a new user
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    //Registration logic
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      user = new User({ name, email, password });
      await user.save();

      //sign and return the token along with user data
      const token = generateToken(user._id, user.role);
      res.status(201).json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

//@route POST /api/users/login
//@desc Login a user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    // check if the password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    //Generate JWT token
    const token = generateToken(user._id, user.role);

    //send user details and token in response
    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

//@route GET /api/users/profile
//@desc Get logged-in user's profile (Protected Route)
router.get("/profile", protect, async (req, res) => {
  res.json(req.user);
});

export default router;
