const express = require("express");
const PaymentSetting = require("../models/PaymentSetting");
const { protectAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

function envPaymentSettings() {
  return {
    bankAccountName: process.env.BANK_ACCOUNT_NAME || "",
    bankName: process.env.BANK_NAME || "",
    bankAccountNumber: process.env.BANK_ACCOUNT_NUMBER || "",
    bankIfsc: process.env.BANK_IFSC || "",
    companyUpiId: process.env.COMPANY_UPI_ID || "",
    companyUpiName: process.env.COMPANY_UPI_NAME || "",
  };
}

// Public: frontend yahi call karega
router.get("/", async (req, res) => {
  const dbSetting = await PaymentSetting.findOne({ isActive: true }).sort({
    updatedAt: -1,
  });

  res.json({
    success: true,
    settings: dbSetting || envPaymentSettings(),
  });
});

// Admin: admin panel se update hoga
router.put("/admin", protectAdmin, async (req, res) => {
  const updated = await PaymentSetting.findOneAndUpdate(
    { isActive: true },
    {
      bankAccountName: req.body.bankAccountName,
      bankName: req.body.bankName,
      bankAccountNumber: req.body.bankAccountNumber,
      bankIfsc: req.body.bankIfsc,
      companyUpiId: req.body.companyUpiId,
      companyUpiName: req.body.companyUpiName,
      isActive: true,
    },
    { new: true, upsert: true }
  );

  res.json({
    success: true,
    message: "Payment settings updated successfully",
    settings: updated,
  });
});

module.exports = router;