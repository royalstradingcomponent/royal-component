const User = require("../models/User");
const Otp = require("../models/Otp");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../services/emailService");
const { OAuth2Client } = require("google-auth-library");
const AdminActivity = require("../models/AdminActivity");
const AdminSession = require("../models/AdminSession");
const SecurityAlert = require("../models/SecurityAlert");

/* ================= GOOGLE CLIENT ================= */
if (!process.env.GOOGLE_CLIENT_ID) {
  console.error("❌ GOOGLE_CLIENT_ID missing in environment variables");
}

if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET missing in environment variables");
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* ================= TOKEN ================= */
const generateToken = (id, tokenVersion = 1) => {
  return jwt.sign(
    {
      id,
      tokenVersion,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    },
  );
};

/* ======================================================
   REGISTER USER (EMAIL + OTP)
====================================================== */
exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, otp, role } = req.body;

    if (!name || !email || !phone || !password || !otp) {
      return res.status(400).json({ message: "All fields and OTP required" });
    }

    const userEmail = email.toLowerCase().trim();

    const userExists = await User.findOne({
      $or: [{ email: userEmail }, { phone }],
    });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const record = await Otp.findOne({ email: userEmail });

    if (!record) return res.status(400).json({ message: "OTP not found" });

    if (String(record.otp) !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const user = await User.create({
      name,
      email: userEmail,
      phone,
      password,
      role: role || "user",
    });

    await record.deleteOne();

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id, user.tokenVersion),
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({
      message: error.message || "Registration failed",
    });
  }
};

/* ======================================================
   LOGIN (PASSWORD)
====================================================== */
exports.loginWithPassword = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if ((!email && !phone) || !password) {
      return res.status(400).json({
        message: "Email/Phone and password required",
      });
    }

    let user;

    if (email) {
      user = await User.findOne({ email: email.toLowerCase().trim() });
    }

    if (phone) {
      user = await User.findOne({ phone });
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id, user.tokenVersion),
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: "Login failed" });
  }
};

/* ======================================================
   LOGIN WITH OTP
====================================================== */
exports.loginUser = async (req, res) => {
  try {
    const { email, phone, otp } = req.body;

    if ((!email && !phone) || !otp) {
      return res.status(400).json({
        message: "Email/Phone and OTP required",
      });
    }

    let user;
    let record;

    if (email) {
      const userEmail = email.toLowerCase().trim();
      user = await User.findOne({ email: userEmail });
      record = await Otp.findOne({ email: userEmail });
    }

    if (phone) {
      user = await User.findOne({ phone });
      record = await Otp.findOne({ phone });
    }

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!record) return res.status(400).json({ message: "OTP not found" });

    if (Date.now() > new Date(record.expiresAt).getTime()) {
      await record.deleteOne();
      return res.status(400).json({ message: "OTP expired" });
    }

    if (String(record.otp) !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await record.deleteOne();

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id, user.tokenVersion),
    });
  } catch (error) {
    console.error("OTP LOGIN ERROR:", error);
    return res.status(500).json({ message: "Login failed" });
  }
};

/* ======================================================
   GOOGLE LOGIN
====================================================== */
/* ======================================================
   GOOGLE LOGIN
====================================================== */
exports.googleLogin = async (req, res) => {
  try {
    const { credential, mode = "login" } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential required",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID.trim(),
    });

    const payload = ticket.getPayload();

    if (!payload?.email) {
      return res.status(400).json({
        success: false,
        message: "Google email not found",
      });
    }

    const userEmail = payload.email.toLowerCase().trim();

    let user = await User.findOne({ email: userEmail });

    if (user && mode === "register") {
      return res.status(409).json({
        success: false,
        message: "This email is already registered. Please login instead.",
      });
    }

    if (!user) {
      user = await User.create({
        name: payload.name || "Google User",
        email: userEmail,
        password: Math.random().toString(36) + Date.now(),
      });
    }

    return res.status(200).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id, user.tokenVersion),
    });
  } catch (error) {
    console.error("GOOGLE LOGIN ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: "Google login failed",
    });
  }
};

/* ======================================================
   FORGOT PASSWORD (EMAIL + PHONE SUPPORTED)
====================================================== */
/* ======================================================
   FORGOT PASSWORD (EMAIL + PHONE SUPPORTED)
====================================================== */
exports.forgotPassword = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).json({
        message: "Email or phone required",
      });
    }

    let user;
    let query = {};
    let userEmail = "";

    if (email) {
      userEmail = email.toLowerCase().trim();

      user = await User.findOne({
        email: userEmail,
      });

      query.email = userEmail;
    }

    if (phone) {
      const cleanPhone = phone.trim();
      user = await User.findOne({ phone: cleanPhone });
      query.phone = cleanPhone;
    }

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.findOneAndUpdate(
      query,
      {
        otp,
        expiresAt,
        attempts: 0,
        lockedUntil: null,
      },
      { upsert: true, new: true },
    );

    console.log("🔐 RESET OTP:", otp);

    if (email) {
      await sendEmail({
        to: userEmail,
        subject: "Password Reset OTP - Royal Component",
        html: `
      <div style="font-family:Arial;padding:20px">
        <h2>Password Reset OTP</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
      </div>
    `,
      });

      console.log("✅ Reset OTP email sent to:", userEmail);
    }

    return res.status(200).json({
      success: true,
      message: "Reset OTP sent",
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    return res.status(500).json({
      message: "Failed to send OTP",
    });
  }
};

/* ======================================================
   VERIFY RESET OTP (EMAIL + PHONE)
====================================================== */
exports.verifyResetOTP = async (req, res) => {
  try {
    const { email, phone, otp } = req.body;

    if ((!email && !phone) || !otp) {
      return res.status(400).json({
        message: "Email/Phone and OTP required",
      });
    }

    let record;
    let identifier = {};

    if (email) {
      const userEmail = email.toLowerCase().trim();
      record = await Otp.findOne({ email: userEmail });
      identifier.email = userEmail;
    }

    if (phone) {
      const cleanPhone = phone.trim();
      record = await Otp.findOne({ phone: cleanPhone });
      identifier.phone = cleanPhone;
    }

    if (!record) {
      return res.status(400).json({
        message: "OTP not found",
      });
    }

    if (Date.now() > new Date(record.expiresAt).getTime()) {
      await record.deleteOne();
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    if (String(record.otp) !== String(otp)) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    const resetToken = jwt.sign(identifier, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    await record.deleteOne();

    return res.status(200).json({
      success: true,
      resetToken,
    });
  } catch (error) {
    console.error("VERIFY RESET OTP ERROR:", error);
    return res.status(500).json({
      message: "OTP verification failed",
    });
  }
};

/* ======================================================
   RESET PASSWORD (EMAIL + PHONE)
====================================================== */
exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        message: "All fields required",
      });
    }

    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);

    let user;

    if (decoded.email) {
      user = await User.findOne({
        email: decoded.email.toLowerCase().trim(),
      });
    }

    if (decoded.phone) {
      user = await User.findOne({
        phone: decoded.phone.trim(),
      });
    }

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
      token: generateToken(user._id, user.tokenVersion),
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    return res.status(400).json({
      message: "Invalid or expired reset token",
    });
  }
};

/* ======================================================
   GET PROFILE
====================================================== */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    return res.status(500).json({
      message: "Failed to fetch profile",
    });
  }
};

/* ======================================================
   UPDATE PROFILE
====================================================== */
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const { name, email, phone } = req.body;

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email.toLowerCase().trim();
    if (phone !== undefined) user.phone = phone;

    const updatedUser = await user.save();

    return res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    return res.status(500).json({
      message: "Failed to update profile",
    });
  }
};

exports.adminSendOtp = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      role: "admin",
    });

    if (!user) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.findOneAndUpdate(
      { email: user.email },
      {
        otp,
        expiresAt,
        attempts: 0,
        lockedUntil: null,
      },
      {
        upsert: true,
        new: true,
      },
    );

    await sendEmail({
      to: user.email,
      subject: "Admin Login OTP",
      html: `
        <h2>Royal Component Admin Login</h2>
        <h1>${otp}</h1>
        <p>OTP valid for 5 minutes.</p>
      `,
    });

    return res.status(200).json({
      success: true,
      email: user.email,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to send OTP",
    });
  }
};

exports.adminVerifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      role: "admin",
    });

    if (!user) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    const record = await Otp.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!record) {
      return res.status(400).json({
        message: "OTP not found",
      });
    }

    if (Date.now() > new Date(record.expiresAt).getTime()) {
      await record.deleteOne();

      return res.status(400).json({
        message: "OTP expired",
      });
    }

    if (String(record.otp) !== String(otp)) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    await record.deleteOne();

    const userAgent = req.headers["user-agent"] || "";

    let browser = "Unknown";
    let os = "Unknown";
    let deviceType = "Desktop";
    let deviceName = "Unknown Device";
    let platform = "Web";

    if (userAgent.includes("Chrome")) browser = "Chrome";
    if (userAgent.includes("Firefox")) browser = "Firefox";
    if (userAgent.includes("Safari") && !userAgent.includes("Chrome"))
      browser = "Safari";
    if (userAgent.includes("Edg")) browser = "Edge";

    if (userAgent.includes("Android")) {
      os = "Android";
    } else if (userAgent.includes("iPhone")) {
      os = "iOS";
    } else if (userAgent.includes("Windows")) {
      os = "Windows";
    } else if (userAgent.includes("Mac")) {
      os = "MacOS";
    } else if (userAgent.includes("Linux")) {
      os = "Linux";
    }

    if (
      userAgent.includes("Mobile") ||
      userAgent.includes("Android") ||
      userAgent.includes("iPhone")
    ) {
      deviceType = "Mobile";
    }
    if (userAgent.includes("Windows")) {
      deviceName = "Windows PC";
    }

    if (userAgent.includes("Mac")) {
      deviceName = "MacBook";
    }

    if (userAgent.includes("Android")) {
      deviceName = "Android Phone";
    }

    if (userAgent.includes("iPhone")) {
      deviceName = "iPhone";
    }

    const ipAddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";

    console.log("ADMIN LOGIN HISTORY SAVE");
    console.log(browser);
    console.log(os);
    console.log(deviceType);
    console.log(ipAddress);

    const existingDevice = user.trustedDevices.find(
  (d) =>
    d.browser === browser &&
    d.os === os &&
    d.ipAddress === ipAddress
);

    if (existingDevice) {

      existingDevice.lastLogin =
        new Date();

    } else {

      user.trustedDevices.push({
        browser,
        os,
        deviceType,
        ipAddress,
        lastLogin: new Date(),
      });

    }

    if (!existingDevice) {
      console.log("CREATING SECURITY ALERT");
      await SecurityAlert.create({
        adminId: user._id,

        type: "NEW_DEVICE_LOGIN",

        title: "New Device Login",

        message:
          `New admin login detected from ${deviceName}`,

        ipAddress,
        browser,
        os,
      });

    }

    const AdminSession = require("../models/AdminSession");

    await AdminSession.updateMany(
      {
        adminId: user._id,
        ipAddress,
        browser,
        isActive: true,
      },
      {
        isActive: false,
        logoutAt: new Date(),
      },
    );

    await AdminSession.create({
      adminId: user._id,

      browser,
      os,

      deviceType,

      deviceName,
      platform,

      ipAddress,

      lastSeenAt: new Date(),
    });

    await User.findByIdAndUpdate(user._id, {
      lastActivity: new Date(),
    });

    await AdminActivity.create({
      adminId: user._id,
      adminName: user.name,

      action: "LOGIN",

      module: "AUTH",

      details: {
        message: "Admin logged in",
      },

      ipAddress,
      browser,
      os,
    });

    await user.save();

    return res.status(200).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.tokenVersion),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "OTP verification failed",
    });
  }
};

exports.adminResendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      role: "admin",
    });

    if (!user) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.findOneAndUpdate(
      { email: user.email },
      {
        otp,
        expiresAt,
      },
      {
        upsert: true,
        new: true,
      },
    );

    await sendEmail({
      to: user.email,
      subject: "Admin Login OTP",
      html: `
        <h2>Royal Component Admin Login</h2>
        <h1>${otp}</h1>
        <p>OTP valid for 5 minutes.</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to resend OTP",
    });
  }
};

exports.adminMe = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user || user.role !== "admin") {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

exports.adminLoginHistory = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const AdminSession = require("../models/AdminSession");

    const sessions = await AdminSession.find({
      adminId: decoded.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      history: sessions,
    });
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};
exports.adminSessions = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const AdminSession = require("../models/AdminSession");

    const sessions = await AdminSession.find({
      adminId: decoded.id,
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      sessions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.adminActivities = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const activities = await AdminActivity.find({
      adminId: decoded.id,
    })
      .sort({ createdAt: -1 })
      .limit(200);

    return res.json({
      success: true,
      activities,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.logoutAllSessions = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    user.tokenVersion += 1;
    await user.save();

    await AdminSession.updateMany(
      {
        adminId: user._id,
        isActive: true,
      },
      {
        isActive: false,
        logoutAt: new Date(),
      },
    );

    await AdminActivity.create({
      adminId: user._id,
      adminName: user.name,

      action: "LOGOUT_ALL_DEVICES",

      module: "SECURITY",

      details: {
        message: "Admin logged out from all devices",
      },
    });

    return res.json({
      success: true,
      message: "Logged out from all devices",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.changeAdminPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      email: "royalstradingcomponent1@gmail.com",
      role: "admin",
    });

    if (!user) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    user.password = "Trading Rohit";

    await user.save();

    return res.json({
      success: true,
      message: "Admin password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};