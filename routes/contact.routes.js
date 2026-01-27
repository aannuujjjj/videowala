console.log("CONTACT ROUTE FILE LOADED");

const express = require("express");
const { sendContactMail } = require("../services/mail.service");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("CONTACT API HIT", req.body);

    const { name, email, phone, country, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await sendContactMail({
      name,
      email,
      phone,
      country,
      message,
    });

    return res.status(200).json({ message: "Contact received" });
  } catch (error) {
    console.error("Contact API error:", error);
    return res.status(500).json({ message: "Failed to send message" });
  }
});

module.exports = router;
