require("dotenv").config();
const { Resend } = require("resend");
const jwt = require("jsonwebtoken");
const Otp = require("../models/Otp");
const User = require("../models/User");

/* =====================================================
   🔐 RESEND INITIALIZATION
===================================================== */
let resend;

if (!process.env.RESEND_API_KEY) {
  console.error("❌ RESEND_API_KEY missing in .env");
} else {
  resend = new Resend(process.env.RESEND_API_KEY);
}

/* =====================================================
   POST /api/otp/send
   EMAIL + PHONE SUPPORT
   REGISTER DUPLICATE CHECK
===================================================== */
exports.sendOTP = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: "Email or phone number is required",
      });
    }

    const userEmail = email ? email.toLowerCase().trim() : null;
    const cleanPhone = phone ? phone.trim() : null;

    /* ================= DUPLICATE USER CHECK ================= */
    if (userEmail) {
      const existingEmailUser = await User.findOne({ email: userEmail });

      if (existingEmailUser) {
        return res.status(409).json({
          success: false,
          message: "This email is already registered. Please login instead.",
        });
      }
    }

    if (cleanPhone) {
      const existingPhoneUser = await User.findOne({ phone: cleanPhone });

      if (existingPhoneUser) {
        return res.status(409).json({
          success: false,
          message:
            "This phone number is already registered. Please login instead.",
        });
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    /* ================= EMAIL OTP ================= */
    if (userEmail) {
      console.log(`🔐 EMAIL OTP for ${userEmail}: ${otp}`);

      await Otp.findOneAndUpdate(
        { email: userEmail },
        {
          otp,
          expiresAt,
          attempts: 0,
          lockedUntil: null,
        },
        { upsert: true, new: true }
      );

      if (!resend) {
        return res.status(500).json({
          success: false,
          message: "Email service not configured",
        });
      }

      await resend.emails.send({
        from: process.env.OTP_FROM_EMAIL,
        to: [userEmail],
        subject: "Your Royal Component verification code",
        html: `
          <div style="font-family: Arial, sans-serif; padding:20px;">
            <h2 style="color:#2454b5;">Royal Component</h2>
            <p>Your verification code is:</p>
            <h1 style="letter-spacing:4px;">${otp}</h1>
            <p style="font-size:12px;color:#555;">
              This code is valid for 5 minutes.
            </p>
          </div>
        `,
      });
    }

    /* ================= PHONE OTP ================= */
    if (cleanPhone) {
      console.log(`📱 MOBILE OTP for ${cleanPhone}: ${otp}`);

      await Otp.findOneAndUpdate(
        { phone: cleanPhone },
        {
          otp,
          expiresAt,
          attempts: 0,
          lockedUntil: null,
        },
        { upsert: true, new: true }
      );

      // Future SMS integration can be added here.
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("❌ OTP SEND ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "OTP send failed",
    });
  }
};

/* =====================================================
   VERIFY OTP FOR LOGIN / REGISTER
===================================================== */
exports.verifyOTP = async (req, res) => {
  try {
    const { email, phone, otp } = req.body;

    if ((!email && !phone) || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email/phone and OTP are required",
      });
    }

    let record;

    if (email) {
      const userEmail = email.toLowerCase().trim();
      record = await Otp.findOne({ email: userEmail });
    }

    if (phone) {
      const cleanPhone = phone.trim();
      record = await Otp.findOne({ phone: cleanPhone });
    }

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    if (Date.now() > record.expiresAt) {
      await record.deleteOne();
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    if (String(record.otp) !== String(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    await record.deleteOne();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("❌ OTP VERIFY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "OTP verification failed",
    });
  }
};

/* =====================================================
   VERIFY OTP FOR PASSWORD RESET
===================================================== */
exports.verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const userEmail = email.toLowerCase().trim();
    const record = await Otp.findOne({ email: userEmail });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    if (Date.now() > record.expiresAt) {
      await record.deleteOne();
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    if (String(record.otp) !== String(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const resetToken = jwt.sign(
      { email: userEmail },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    await record.deleteOne();

    return res.status(200).json({
      success: true,
      resetToken,
    });
  } catch (error) {
    console.error("❌ RESET OTP VERIFY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Reset OTP verification failed",
    });
  }
};