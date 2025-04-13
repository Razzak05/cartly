import express from "express";
import Product from "../models/Product.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

//@route GET /api/admin/products
//@desc Get all products (Admin only)
//@access Private/Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//@route POST /api/admin/products/create
//@desc create a new product
//@access Private/Admin
router.post("/create", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;

    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Create product error: ", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

export default router;
