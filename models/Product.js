// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true }, // matches the .html filename, e.g. "choco"
  name: { type: String, required: true },
  price: { type: Number, required: true },
  mrp: { type: Number, required: true },
  unit: { type: String, default: "" },
  rating: { type: String, default: "" },
  image: { type: String, required: true },
  description: { type: String, default: "" },
});

module.exports = mongoose.model("Product", productSchema);
