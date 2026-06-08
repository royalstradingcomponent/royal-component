const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const authMiddleware = require("../middleware/authMiddleware");

const protectAdmin =
  authMiddleware.protectAdmin ||
  authMiddleware.adminProtect ||
  authMiddleware.protect;

const uploadDir = path.join(__dirname, "../uploads/blogs");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },

  filename(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = file.originalname
      .replace(ext, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    cb(null, `${Date.now()}-${safeName}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Only JPG, PNG and WEBP images are allowed"), false);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// POST /api/blog-upload/image
router.post(
  "/image",
  protectAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Image file is required",
        });
      }

      const originalPath = req.file.path;

      const webpFilename =
        path.parse(req.file.filename).name + ".webp";

      const webpPath = path.join(
        uploadDir,
        webpFilename
      );

      await sharp(originalPath)
        .webp({
          quality: 75,
          effort: 6,
        })
        .toFile(webpPath);

      fs.unlinkSync(originalPath);

      const imageUrl =
        `/uploads/blogs/${webpFilename}`;

      res.status(201).json({
        success: true,
        message: "Image uploaded successfully",
        imageUrl,
      });

    } catch (error) {
      console.error("Blog image upload error:", error);
      res.status(500).json({
        success: false,
        message: "Image upload failed",
      });
    }
  }
);

module.exports = router;