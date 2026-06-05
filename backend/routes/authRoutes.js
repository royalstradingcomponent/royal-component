const express = require("express");
const router = express.Router();

/* ===============================
   CONTROLLERS IMPORT 
================================ */
const {
   registerUser,
   loginUser,
   loginWithPassword,
   adminSendOtp,
   adminVerifyOtp,
   googleLogin,
   forgotPassword,
   verifyResetOTP,
   resetPassword,
   adminResendOtp,
   adminMe,
   adminLoginHistory,
   adminSessions,
   adminActivities,
} = require("../controllers/authController");
const { protect, admin } = require("../middleware/authMiddleware");

const { sendOTP, verifyOTP } = require("../controllers/otpController");

/* ===============================
   🆕 REGISTER
================================ */
router.post("/register", registerUser);

/* ===============================
   🔐 LOGIN (PASSWORD)
================================ */
router.post("/login", loginWithPassword);
router.post("/admin/send-otp", adminSendOtp);
router.post("/admin/resend-otp", adminResendOtp);
router.post("/admin/verify-otp", adminVerifyOtp);
router.get("/admin/me", adminMe);
router.get("/admin/login-history", adminLoginHistory);
router.get("/admin/sessions", adminSessions);
router.get("/admin/activities", adminActivities);

/* ===============================
   🔐 LOGIN WITH OTP FLOW
================================ */
router.post("/login/send-otp", sendOTP);
router.post("/login/verify-otp", loginUser);

/* ===============================
   🔐 GOOGLE LOGIN
================================ */
router.post("/google", googleLogin);

/* ===============================
   🔁 PASSWORD RESET FLOW
================================ */
router.post("/password/forgot", forgotPassword);
router.post("/password/verify-otp", verifyResetOTP);
router.post("/password/reset", resetPassword);

module.exports = router;
