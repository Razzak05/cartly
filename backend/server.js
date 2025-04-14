import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import configurePassport from "./config/passportGoogle.js";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";
import orderRoutes from "./routes/orderRoute.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import subscribeRoute from "./routes/subscribeRoute.js";
import adminRoute from "./routes/adminRoutes.js";
import productAdminRoute from "./routes/productAdminRoutes.js";
import adminOrderRoute from "./routes/adminOrderRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Proper CORS Configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// Handle pre-flight requests
app.options("*", cors());
app.use(cookieParser());
configurePassport();
app.use(passport.initialize());

// Test API
app.get("/", (req, res) => {
  res.send("Welcome to CARTLY");
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/subscribe", subscribeRoute);

// Admin Routes
app.use("/api/admin/users", adminRoute);
app.use("/api/admin/products", productAdminRoute);
app.use("/api/admin/orders", adminOrderRoute);

const PORT = process.env.PORT || 9000; // Ensure it matches .env
connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
