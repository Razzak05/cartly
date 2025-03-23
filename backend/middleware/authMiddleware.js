import jwt from "jsonwebtoken";

//Middleware to protect routes
const protect = async (req, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from header
      token = req.header.authorization.split(" ")[1];
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Fetch the user from database
      req.user = await User.findById(decoded.user.id).select("-password");
      next();
    } catch (error) {
      console.error("Authorization Error:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
};

export default protect;
