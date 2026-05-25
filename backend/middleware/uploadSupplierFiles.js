const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/supplier-files/");
  },

  filename(req, file, cb) {
    cb(
      null,
      `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}${path.extname(file.originalname)}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and Images allowed"));
  }
};

module.exports = multer({
  storage,
  fileFilter,
});