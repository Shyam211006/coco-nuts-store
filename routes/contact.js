// routes/contact.js
const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// POST /api/contact  { name, email, subject, message } -> saves an enquiry
router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "name and email are required" });
  }

  await Contact.create({ name, email, subject: subject || "", message: message || "" });
  res.json({ message: "Thanks! We received your message and will get back to you soon." });
});

module.exports = router;
