import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from Authorization header
      token = req.headers.authorization.split(" ")[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the user from the database (excluding password)
      req.user = await User.findById(decoded.user.id).select("-password");

      next(); // Proceed to the next middleware/controller
    } catch (error) {
      console.error(error.message);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

//middleware to check if the user is an admin
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};
