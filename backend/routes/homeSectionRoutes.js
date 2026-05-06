const express = require("express");
const router = express.Router();
const HomeSection = require("../models/HomeSection");

router.get("/", async (req, res) => {
  try {
    const sections = await HomeSection.find({ isActive: true }).sort({
      order: 1,
      createdAt: -1,
    });

    res.json({ success: true, sections });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Home sections fetch failed",
    });
  }
});

module.exports = router;