const express = require("express");
const router = express.Router();

const {
  createSupplierSource,
  getSupplierSources,
  updateSupplierSource,
  deleteSupplierSource,
  matchSupplierSources,
} = require("../controllers/supplierSourceController");

const { protect, admin } = require("../middleware/authMiddleware");

router.use(protect, admin);

router.get("/", getSupplierSources);
router.post("/", createSupplierSource);
router.post("/match", matchSupplierSources);
router.put("/:id", updateSupplierSource);
router.delete("/:id", deleteSupplierSource);

module.exports = router;