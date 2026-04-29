const express = require("express");
const router = express.Router();

const {
  getCategories,
  getCategoryBySlug,
  createCategory,
  bulkCreateCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

router.get("/", getCategories);

// bulk route ko /:slug se pehle rakhna zaroori hai
router.post("/bulk", bulkCreateCategories);

router.get("/:slug", getCategoryBySlug);

router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;