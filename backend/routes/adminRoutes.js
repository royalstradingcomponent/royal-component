const express = require("express");
const router = express.Router();

const { protect, admin } = require("../middleware/authMiddleware");
const adminController = require("../controllers/adminController");
const upload = require("../middleware/upload");

/* ================= DASHBOARD ================= */
router.get("/stats/counts", protect, admin, adminController.getCounts);
router.get("/sales-graph", protect, admin, adminController.getSalesGraph);

/* ================= CATEGORY LEVELS ================= */
router.get("/categories/main", protect, admin, adminController.getMainCategories);
router.get("/categories/sub", protect, admin, adminController.getSubCategories);
router.get("/categories/child", protect, admin, adminController.getChildCategories);

/* ================= NAVBAR CATEGORIES ================= */
router.get("/navbar-categories", protect, admin, adminController.getNavbarCategories);
router.patch("/navbar-categories/:id", protect, admin, adminController.updateNavbarCategory);

/* ================= FILE UPLOAD ================= */
router.post(
  "/upload",
  protect,
  admin,
  upload.single("file"),
  adminController.uploadFile
);


/* ================= HERO BANNERS ================= */
router.get("/hero-slides", protect, admin, adminController.getHeroSlides);
router.post("/hero-slides", protect, admin, adminController.createHeroSlide);
router.put("/hero-slides/:id", protect, admin, adminController.updateHeroSlide);
router.delete("/hero-slides/:id", protect, admin, adminController.deleteHeroSlide);

/* ================= PRODUCTS ================= */
router.get("/products", protect, admin, adminController.getProducts);
router.post("/products", protect, admin, adminController.createProduct);
router.put("/products/:id", protect, admin, adminController.updateProduct);
router.delete("/products/:id", protect, admin, adminController.deleteProduct);
router.post("/products/delete-many", protect, admin, adminController.deleteManyProducts);

/* ================= HOME SECTIONS ================= */
router.get("/home-sections", protect, admin, adminController.getHomeSections);
router.post("/home-sections", protect, admin, adminController.createHomeSection);
router.put("/home-sections/:id", protect, admin, adminController.updateHomeSection);
router.delete("/home-sections/:id", protect, admin, adminController.deleteHomeSection);

/* ================= INVENTORY ================= */
router.get("/inventory", protect, admin, adminController.getInventory);
router.patch("/inventory/:id", protect, admin, adminController.updateInventory);

/* ================= CATEGORIES ================= */
router.get("/categories", protect, admin, adminController.getCategories);
router.post("/categories", protect, admin, adminController.createCategory);
router.put("/categories/:id", protect, admin, adminController.updateCategory);
router.delete("/categories/:id", protect, admin, adminController.deleteCategory);
router.post("/categories/delete-many", protect, admin, adminController.deleteManyCategories);

/* ================= ORDERS ================= */
router.get("/orders", protect, admin, adminController.getOrders);
router.get("/orders/analytics", protect, admin, adminController.getOrderAnalytics);
router.post("/orders/details", protect, admin, adminController.getOrdersDetails);
router.put("/orders/status", protect, admin, adminController.updateOrderStatus);
router.put("/orders/address", protect, admin, adminController.updateOrderAddress);

/* ================= CUSTOMERS ================= */
router.get("/customers", protect, admin, adminController.getCustomers);
router.get("/customers/:id", protect, admin, adminController.getCustomerById);
router.put("/customers/:id", protect, admin, adminController.updateCustomer);
router.delete("/users/:id", protect, admin, adminController.deleteUser);
router.patch("/users/:id/status", protect, admin, adminController.toggleUserStatus);

/* ================= COUPONS ================= */
router.get("/coupons", protect, admin, adminController.getCoupons);
router.post("/coupons", protect, admin, adminController.createCoupon);
router.put("/coupons/:id", protect, admin, adminController.updateCoupon);
router.delete("/coupons/:id", protect, admin, adminController.deleteCoupon);

/* ================= SUPPORT CHATS ================= */
router.get("/chats", protect, admin, adminController.getChats);
router.get("/chats/:id", protect, admin, adminController.getChatById);
router.post("/chats/:id/reply", protect, admin, adminController.replyChat);
router.patch("/chats/:id/status", protect, admin, adminController.updateChatStatus);

/* ================= POLICY PAGES ================= */
router.get("/policies", protect, admin, adminController.getPolicyPages);
router.post("/policies", protect, admin, adminController.createPolicyPage);
router.put("/policies/:id", protect, admin, adminController.updatePolicyPage);
router.delete("/policies/:id", protect, admin, adminController.deletePolicyPage);

module.exports = router;