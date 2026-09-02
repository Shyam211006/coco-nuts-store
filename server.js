// server.js
require("dotenv").config();

const path = require("path");
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const connectDB = require("./config/db");
const productsRouter = require("./routes/products");
const cartRouter = require("./routes/cart");
const ordersRouter = require("./routes/orders");
const contactRouter = require("./routes/contact");
const seedRouter = require("./routes/seed");

const app = express();
const PORT = process.env.PORT || 3000;

async function start() {
  await connectDB();

  app.use(express.json());

  // Sessions are stored in MongoDB too, so carts survive server restarts.
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "coco-nuts-secret-key",
      resave: false,
      saveUninitialized: true,
      store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
      cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // 7 days
    })
  );

  // Serve the front-end (index.html, choco.html, style.css, images, etc.)
  app.use(express.static(path.join(__dirname, "public")));

  // API routes
  app.use("/api/products", productsRouter);
  app.use("/api/cart", cartRouter);
  app.use("/api/orders", ordersRouter);
  app.use("/api/contact", contactRouter);
  app.use("/api/seed", seedRouter);

  app.listen(PORT, () => {
    console.log(`Coco Nuts server running at http://localhost:${PORT}`);
  });
}

start();
