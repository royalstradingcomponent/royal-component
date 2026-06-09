const express = require("express");

const router = express.Router();
const upload = require("../middleware/upload");

const {
  createLandingPage,
  updateLandingPage,
  deleteLandingPage,
  getLandingPages,
  getLandingPageBySlug,
  getLandingPageById,
} = require("../controllers/landingPageController");

router.get("/", getLandingPages);

router.get("/id/:id", getLandingPageById);

router.get("/:slug", getLandingPageBySlug);

router.post(
  "/upload",
  upload.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    res.json({
      success: true,
      imageUrl: `/uploads/landing-pages/${req.file.filename}`,
    });
  }
);

router.post("/", createLandingPage);

router.put("/:id", updateLandingPage);

router.delete("/:id", deleteLandingPage);

module.exports = router;