const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");

const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const categoryRoutes = require("./routes/categoryRoutes");
const couponRoutes = require("./routes/couponRoutes");
const chatRoutes = require("./routes/chatRoutes");
const contactPageRoutes = require("./routes/contactPageRoutes");
const seoLoaderRoutes = require("./routes/seoLoaderRoutes");
const aboutPageRoutes = require("./routes/aboutPageRoutes");
const footerPageRoutes = require("./routes/footerPageRoutes");
const blogRoutes = require("./routes/blogRoutes");
const blogCategoryRoutes = require("./routes/blogCategoryRoutes");
const blogUploadRoutes = require("./routes/blogUploadRoutes");
const blogPageSettingRoutes = require("./routes/blogPageSettingRoutes");
const homeDecorInfoRoutes = require("./routes/homeDecorInfoRoutes");

dotenv.config();

const app = express();

app.set("trust proxy", 1);

connectDB();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://royalsmd.com",
  "https://www.royalsmd.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
].filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }

    console.log("CORS Blocked:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Cache-Control",
    "Pragma",
  ],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },

    crossOriginEmbedderPolicy: false,
  }),
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 500 : 10000,
  standardHeaders: true,
  legacyHeaders: false,

  skip: (req) => {
    return (
      req.path.startsWith("/footer-page") ||
      req.path.startsWith("/home-sections") ||
      req.path.startsWith("/hero-slides") ||
      req.path.startsWith("/categories")
    );
  },

  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use("/api", apiLimiter);

app.use(express.json({ limit: "25mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "25mb",
  }),
);

if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`,
    );

    next();
  });
}

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Royal Component API running",
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/otp", require("./routes/otpRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/footer-page", footerPageRoutes);
app.use("/api/users/address", require("./routes/addressRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

app.use("/api/categories", categoryRoutes);
app.use("/api/hero-slides", require("./routes/heroRoutes"));
app.use("/api/home-sections", require("./routes/homeSectionRoutes"));
app.use("/api/coupons", couponRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/policies", require("./routes/policyRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/component-requests", require("./routes/componentRequestRoutes"));

app.use("/api/purchase-history", require("./routes/purchaseHistoryRoutes"));
app.use("/api/supplier-sources", require("./routes/supplierSourceRoutes"));
app.use("/api/contact-page", contactPageRoutes);
app.use("/api/seo-loader", seoLoaderRoutes);
app.use("/api/about-page", aboutPageRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/blog-categories", blogCategoryRoutes);
app.use("/api/blog-upload", blogUploadRoutes);
app.use("/api/blog-page-setting", blogPageSettingRoutes);
app.use("/api/theme", require("./routes/themeRoutes"));
app.use("/api/home-decor-info", homeDecorInfoRoutes);
app.use("/api/promo-banners", require("./routes/promoBannerRoutes"));
app.use("/api/homepage-builder", require("./routes/homepageBuilderRoutes"));
app.use("/api/landing-pages", require("./routes/landingPageRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log("=================================");
  console.log(`Server running on port ${PORT}`);
  console.log("=================================");
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err.message);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err.message);
  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("Process terminated");
  });
});
