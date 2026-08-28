// routes/orders.js
const express = require("express");
const router = express.Router();
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");
const Order = require("../models/Order");

// POST /api/orders  { name, email, phone, address } -> turns the cart into an order
router.post("/", async (req, res) => {
  const { name, email, phone, address } = req.body;
  if (!name || !email || !address) {
    return res.status(400).json({ error: "name, email and address are required" });
  }

  const cartItems = await CartItem.find({ sessionId: req.sessionID }).lean();
  if (cartItems.length === 0) {
    return res.status(400).json({ error: "Your cart is empty" });
  }

  const slugs = cartItems.map((i) => i.productSlug);
  const products = await Product.find({ slug: { $in: slugs } }).lean();
  const productBySlug = Object.fromEntries(products.map((p) => [p.slug, p]));

  const items = cartItems.map((i) => {
    const p = productBySlug[i.productSlug];
    return {
      productSlug: p.slug,
      productName: p.name,
      price: p.price,
      quantity: i.quantity,
    };
  });

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const order = await Order.create({
    sessionId: req.sessionID,
    name,
    email,
    phone: phone || "",
    address,
    items,
    total,
  });

  await CartItem.deleteMany({ sessionId: req.sessionID });

  res.json({ message: "Order placed successfully", orderId: order._id, total });
});

// GET /api/orders/:id -> order confirmation details
router.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id).lean();
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

module.exports = router;
