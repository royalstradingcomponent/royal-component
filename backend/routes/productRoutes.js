const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/search-temp/" });


const {
  getProducts,
  getFeaturedProducts,
  getProductFilterMeta,
  getProductById,
  getProductBySlug,
  getProductBySku,
  getSimilarProducts,
  createProduct,
  bulkCreateProducts,
  seedBulkProducts,
  updateProduct,
  searchProductsByImage,
  checkProductMatch,
  deleteProduct,
} = require("../controllers/productController");

// Public routes
router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/filters-meta", getProductFilterMeta);
router.get("/slug/:slug", getProductBySlug);
router.get("/similar/:id", getSimilarProducts);
router.post("/search-by-image", upload.single("image"), searchProductsByImage);
router.post("/check-match", upload.single("image"), checkProductMatch);
router.get("/:id", getProductById);
router.get("/sku/:sku", getProductBySku);
// Admin routes
router.post("/", createProduct);
router.post("/bulk", bulkCreateProducts);
router.post("/seed-bulk", seedBulkProducts);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
