import express from "express";
import passport from "passport";
import User from "../models/User.js";
import generateToken from "../util/generateToken.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

//---------------------------------------------------
// Traditional Email/Password Routes
//---------------------------------------------------

//@route POST /api/users/register
//@desc Register a new user
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    user = new User({ name, email, password });
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    // Set token as HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: "strict",
    });

    // Send user details in response
    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

//@route POST /api/users/login
//@desc Login a user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user by email
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Check if the password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    // Set token as HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    // Send user details in response
    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

//@route GET /api/users/me
//@desc Get logged-in user's profile (Protected Route)
router.get("/me", protect, async (req, res) => {
  try {
    res.json({
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error("Fetch User Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

//@route POST /api/users/logout
//@desc Logout a user
router.post("/logout", async (req, res) => {
  try {
    // Clear the token cookie
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0), // Expire immediately
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

//@route GET /api/users/profile
//@desc Get logged-in user's profile (Protected Route) - For backward compatibility
router.get("/profile", protect, async (req, res) => {
  try {
    res.json({
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

//---------------------------------------------------
// Google OAuth Routes (Using Passport)
//---------------------------------------------------

//@route GET /api/users/auth/google
//@desc Initiate Google OAuth login
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

//@route GET /api/users/auth/google/callback
//@desc Google OAuth callback endpoint
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login", // Adjust as needed for your UI
    session: false, // Using JWT, not sessions
  }),
  (req, res) => {
    // Successful authentication: generate JWT token
    const token = generateToken(req.user._id, req.user.role);

    // Set token as HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    // Redirect the user to the client app
    res.redirect(process.env.FRONTEND_URL);
  }
);

export default router;
