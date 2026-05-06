const express = require("express");
const router = express.Router();

const {
  getContactPage,
  adminGetContactPage,
  adminUpdateContactPage,
} = require("../controllers/contactPageController");

const { protect, admin } = require("../middleware/authMiddleware");

// ================= PUBLIC =================
router.get("/", getContactPage);

// ================= ADMIN =================
router.get("/admin", protect, admin, adminGetContactPage);

router.put("/admin", protect, admin, adminUpdateContactPage);

module.exports = router;