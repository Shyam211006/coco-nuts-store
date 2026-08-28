// routes/cart.js
const express = require("express");
const router = express.Router();
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");

// Helper: build the current cart (joined with product info) for a session
async function getCart(sessionId) {
  const items = await CartItem.find({ sessionId }).lean();
  const slugs = items.map((i) => i.productSlug);
  const products = await Product.find({ slug: { $in: slugs } }).lean();
  const productBySlug = Object.fromEntries(products.map((p) => [p.slug, p]));

  const rows = items
    .filter((i) => productBySlug[i.productSlug])
    .map((i) => {
      const p = productBySlug[i.productSlug];
      return {
        id: i._id,
        slug: p.slug,
        name: p.name,
        price: p.price,
        image: p.image,
        quantity: i.quantity,
      };
    });

  const total = rows.reduce((sum, r) => sum + r.price * r.quantity, 0);
  return { items: rows, total };
}

// GET /api/cart -> view current cart
router.get("/", async (req, res) => {
  res.json(await getCart(req.sessionID));
});

// POST /api/cart  { slug, quantity } -> add to cart (or bump quantity)
router.post("/", async (req, res) => {
  const { slug, quantity } = req.body;
  const qty = parseInt(quantity, 10) || 1;

  const product = await Product.findOne({ slug });
  if (!product) return res.status(404).json({ error: "Product not found" });

  const existing = await CartItem.findOne({ sessionId: req.sessionID, productSlug: slug });
  if (existing) {
    existing.quantity += qty;
    await existing.save();
  } else {
    await CartItem.create({ sessionId: req.sessionID, productSlug: slug, quantity: qty });
  }

  res.json({ message: `${product.name} added to cart`, cart: await getCart(req.sessionID) });
});

// DELETE /api/cart/:id -> remove one line item from the cart
router.delete("/:id", async (req, res) => {
  await CartItem.deleteOne({ _id: req.params.id, sessionId: req.sessionID });
  res.json({ message: "Item removed", cart: await getCart(req.sessionID) });
});

module.exports = router;
