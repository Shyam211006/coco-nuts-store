// models/CartItem.js
const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    productSlug: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CartItem", cartItemSchema);
