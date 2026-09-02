// routes/seed.js
// A browser-triggered version of seed.js — visit this URL once on your LIVE
// site to load products, useful when your local network blocks the
// mongodb+srv:// DNS lookup but your hosting provider (Render) doesn't.
//
// Protected by a simple secret key so random visitors can't wipe your
// product catalog. Set SEED_KEY in your environment variables (Render
// Environment tab, or your local .env) to any password you choose.
//
// Visit:  https://your-render-url.onrender.com/api/seed?key=YOUR_SEED_KEY

const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

const products = [
  { slug: "coconut", name: "Fresh Coconut", price: 80, mrp: 100, unit: "", rating: "4.8", image: "images/pic1.png",
    description: "Enjoy the freshness of naturally grown coconuts. Rich in nutrients, vitamins, and minerals." },
  { slug: "water", name: "Fresh Coconut Water", price: 120, mrp: 160, unit: "", rating: "4.7", image: "images/pic2.png",
    description: "Refreshing natural coconut water, rich in electrolytes, vitamins, and essential minerals." },
  { slug: "oil", name: "Coconut Oil", price: 300, mrp: 428, unit: "", rating: "4.8", image: "images/pic3.png",
    description: "Pure natural coconut oil, rich in healthy fats, vitamins, and antioxidants." },
  { slug: "choco", name: "Coconut Chocolate", price: 80, mrp: 100, unit: "", rating: "4.6", image: "images/pic4.png",
    description: "Rich and delicious Coconut Chocolate made with premium chocolate and natural coconut." },
  { slug: "soap", name: "Coconut Soap", price: 60, mrp: 100, unit: "", rating: "4.4", image: "images/pic5.png",
    description: "Natural coconut soap that gently cleanses and nourishes your skin." },
  { slug: "shell", name: "Shell Product", price: 40, mrp: 60, unit: "", rating: "4.8", image: "images/pic6.png",
    description: "Eco-friendly coconut shell products, handcrafted from natural coconut shells." },
  { slug: "fib", name: "Coconut Fiber", price: 15, mrp: 25, unit: "per kg", rating: "4.9", image: "images/pic7.png",
    description: "Premium-quality coconut fiber made from natural coconut husks, strong and eco-friendly." },
  { slug: "cream", name: "Coconut Milk & Cream", price: 100, mrp: 145, unit: "per 500ml", rating: "4.9", image: "images/pic8.png",
    description: "Rich and creamy natural Coconut Milk & Cream, perfect for cooking, baking, and desserts." },
  { slug: "desicated", name: "Desiccated Coconut", price: 180, mrp: 240, unit: "per kg", rating: "4.7", image: "images/pic9.png",
    description: "Premium desiccated coconut, finely grated and naturally dried, rich in dietary fiber." },
];

router.get("/", async (req, res) => {
  const providedKey = req.query.key;
  const realKey = process.env.SEED_KEY;

  if (!realKey) {
    return res.status(500).send("SEED_KEY is not set in your environment variables. Add it, then redeploy.");
  }
  if (providedKey !== realKey) {
    return res.status(403).send("Wrong or missing key. Visit this URL with ?key=YOUR_SEED_KEY");
  }

  await Product.deleteMany({});
  await Product.insertMany(products);

  res.send(`Seeded ${products.length} products successfully. You can now remove this route if you want.`);
});

module.exports = router;
