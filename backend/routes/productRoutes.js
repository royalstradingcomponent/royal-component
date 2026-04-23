const express = require("express");
const router = express.Router();

const {
  getProducts,
  getFeaturedProducts,
  getProductFilterMeta,
  getProductById,
  getProductBySlug,
  getSimilarProducts,
  createProduct,
  bulkCreateProducts,
  seedBulkProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Public routes
router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/filters-meta", getProductFilterMeta);
router.get("/slug/:slug", getProductBySlug);
router.get("/similar/:id", getSimilarProducts);
router.get("/:id", getProductById);

// Admin routes
router.post("/", createProduct);
router.post("/bulk", bulkCreateProducts);
router.post("/seed-bulk", seedBulkProducts);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;