// routes/products.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET /api/products -> list every product
router.get("/", async (req, res) => {
  const products = await Product.find().lean();
  res.json(products);
});

// GET /api/products/:slug -> a single product (used on each product page)
router.get("/:slug", async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).lean();
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

module.exports = router;
