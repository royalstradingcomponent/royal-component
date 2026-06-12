const express = require("express");
const router = express.Router();

const { protect, admin } = require("../middleware/authMiddleware");

const {
  getTheme,
  updateTheme,
  resetTheme,
} = require("../controllers/themeController");

/* ==========================
   PUBLIC
========================== */

router.get("/", getTheme);

/* ==========================
   ADMIN
========================== */

router.put(
  "/",
  protect,
  admin,
  updateTheme
);

router.post(
  "/reset",
  protect,
  admin,
  resetTheme
);

module.exports = router;