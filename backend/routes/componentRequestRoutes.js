const express = require("express");
const router = express.Router();

const {
  createComponentRequest,
  getAllComponentRequests,
  updateComponentRequest,
  getMyComponentRequests,
  getComponentRequestsByEmail,
} = require("../controllers/componentRequestController");

const { protect, admin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadRequestFiles");

router.post(
  "/",
  upload.fields([
  { name: "datasheets", maxCount: 10 },
  { name: "images", maxCount: 10 },
]),
  createComponentRequest
);

router.get("/lookup", getComponentRequestsByEmail);
router.get("/my", protect, getMyComponentRequests);

router.get("/admin", protect, admin, getAllComponentRequests);

router.put("/admin/:id", protect, admin, updateComponentRequest);

module.exports = router;