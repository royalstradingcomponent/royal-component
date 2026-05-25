const express = require("express");

const router = express.Router();

const {
  findSourceHistory,
} = require("../controllers/purchaseHistoryController");

const {
  protect,
  admin,
} = require("../middleware/authMiddleware");

router.get(
  "/find-source",
  protect,
  admin,
  findSourceHistory
);

module.exports = router;