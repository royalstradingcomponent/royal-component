const express = require("express");

const router = express.Router();

const {
  getSections,
  getSingleSection,
  createSection,
  updateSection,
  deleteSection,
  getActiveSections,
} = require(
  "../controllers/homepageBuilderController"
);

router.get(
  "/active",
  getActiveSections
);

router.get("/", getSections);

router.get(
  "/:id",
  getSingleSection
);

router.post(
  "/",
  createSection
);

router.put(
  "/:id",
  updateSection
);

router.delete(
  "/:id",
  deleteSection
);

module.exports = router;