const express = require("express");
const router = express.Router();
const HeroSlide = require("../models/HeroSlide");

router.get("/", async (req, res) => {
  try {
    const slides = await HeroSlide.find({ isActive: true }).sort({
      order: 1,
      createdAt: -1,
    });

    res.json({
      success: true,
      slides,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Hero slides fetch failed",
    });
  }
});

module.exports = router;