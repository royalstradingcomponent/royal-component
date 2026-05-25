const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadSupplierFiles");

const {
  createSupplierSource,
  getSupplierSources,
  getSupplierSourceById,
  updateSupplierSource,
  deleteSupplierSource,
  matchSupplierSources,
  importOfferText,
} = require("../controllers/supplierSourceController");

const { protect, admin } = require("../middleware/authMiddleware");

router.use(protect, admin);

router.get("/", getSupplierSources);
router.get("/:id", getSupplierSourceById);
router.post(
  "/",
  upload.fields([
    { name: "supplierPdf", maxCount: 1 },
    { name: "supplierImages", maxCount: 10 },
  ]),
  createSupplierSource,
);

router.post("/match", matchSupplierSources);
router.post("/import-offer", importOfferText);
router.put(
  "/:id",
  upload.fields([
    { name: "supplierPdf", maxCount: 1 },
    { name: "supplierImages", maxCount: 10 },
  ]),
  updateSupplierSource,
);
router.delete("/:id", deleteSupplierSource);

module.exports = router;
