const express = require("express");

const router = express.Router();

const {
  getAllPromoBanners,
  getPromoBannersByPosition,
  createPromoBanner,
  updatePromoBanner,
  deletePromoBanner,
  getSinglePromoBanner,
} = require(
  "../controllers/promoBannerController"
);

router.get("/", getAllPromoBanners);

router.get(
  "/position/:position",
  getPromoBannersByPosition
);

router.get("/:id", getSinglePromoBanner);

router.post("/", createPromoBanner);

router.put("/:id", updatePromoBanner);

router.delete("/:id", deletePromoBanner);

module.exports = router;