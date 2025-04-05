import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Helper: Find cart by user or guest
const getCart = async (userId, guestId) => {
  if (userId) return await Cart.findOne({ user: userId });
  if (guestId) return await Cart.findOne({ guestId });
  return null;
};

// @route   POST /api/cart
// @desc    Add a product to the cart
// @access  Public
router.post("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await getCart(userId, guestId);
    if (cart) {
      // Check if product already exists in cart (match productId, size, and color)
      const existingIndex = cart.products.findIndex(
        (item) =>
          item.productId.toString() === productId &&
          item.size === size &&
          item.color === color
      );

      if (existingIndex > -1) {
        // Increase the quantity
        cart.products[existingIndex].quantity += quantity;
      } else {
        // Add new product item
        cart.products.push({
          productId,
          name: product.name,
          image: product.images[0]?.url || "",
          price: product.price,
          quantity,
          size,
          color,
        });
      }
      // Recalculate total price
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      // Create a new cart if one doesn't exist
      const newCart = await Cart.create({
        user: userId ? userId : undefined,
        guestId: guestId ? guestId : "guest_" + Date.now(),
        products: [
          {
            productId,
            name: product.name,
            image: product.images[0]?.url || "",
            price: product.price,
            quantity,
            size,
            color,
          },
        ],
        totalPrice: product.price * quantity,
      });
      return res.status(201).json(newCart);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

// @route   PUT /api/cart
// @desc    Update product quantity in the cart
// @access  Public
router.put("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;
  try {
    let cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const existingItem = cart.products.find(
      (item) =>
        item.productId.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (existingItem) {
      if (quantity > 0) {
        existingItem.quantity = quantity;
      } else {
        // Remove the item if quantity is 0 (or less)
        cart.products = cart.products.filter(
          (item) =>
            !(
              item.productId.toString() === productId &&
              item.size === size &&
              item.color === color
            )
        );
      }
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

// @route   DELETE /api/cart
// @desc    Remove a product from the cart
// @access  Public
router.delete("/", async (req, res) => {
  const { productId, size, color, guestId, userId } = req.body;
  try {
    let cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const index = cart.products.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (index > -1) {
      cart.products.splice(index, 1);
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

// @route   GET /api/cart
// @desc    Get the cart for a guest or logged-in user
// @access  Public
router.get("/", async (req, res) => {
  const { userId, guestId } = req.query;
  try {
    const cart = await getCart(userId, guestId);
    if (cart) return res.status(200).json(cart);
    else return res.status(404).json({ message: "Cart not found" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

// @route   POST /api/cart/merge
// @desc    Merge guest cart into user cart on login
// @access  Private
router.post("/merge", protect, async (req, res) => {
  const { guestId } = req.body;
  try {
    const guestCart = await Cart.findOne({ guestId });
    const userCart = await Cart.findOne({ user: req.user._id });

    if (guestCart) {
      if (guestCart.products.length === 0)
        return res.status(400).json({ message: "Guest cart is empty" });

      if (userCart) {
        // Merge guest items into the existing user cart
        guestCart.products.forEach((guestItem) => {
          const index = userCart.products.findIndex(
            (item) =>
              item.productId.toString() === guestItem.productId.toString() &&
              item.size === guestItem.size &&
              item.color === guestItem.color
          );
          if (index > -1) {
            userCart.products[index].quantity += guestItem.quantity;
          } else {
            userCart.products.push(guestItem);
          }
        });
        userCart.totalPrice = userCart.products.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        await userCart.save();
        await Cart.findOneAndDelete({ guestId });
        return res.status(200).json(userCart);
      } else {
        // No user cart exists—create one from the guest cart
        const newUserCart = await Cart.create({
          user: req.user._id,
          products: guestCart.products,
          totalPrice: guestCart.totalPrice,
        });
        await Cart.findOneAndDelete({ guestId });
        return res.status(200).json(newUserCart);
      }
    } else {
      // No guest cart exists; return the user cart if available
      if (userCart) return res.status(200).json(userCart);
      return res.status(404).json({ message: "Guest cart not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

export default router;
