const PaymentSetting = require("../models/PaymentSetting");

function getEnvBankDetails() {
  return {
    accountName: process.env.BANK_ACCOUNT_NAME || "Royal Component",
    bankName: process.env.BANK_NAME || "",
    accountNumber: process.env.BANK_ACCOUNT_NUMBER || "",
    ifsc: process.env.BANK_IFSC || "",
    upiId: process.env.COMPANY_UPI_ID || "",
    upiName: process.env.COMPANY_UPI_NAME || "Royal Component",
  };
}

function convertSettingToBankDetails(setting) {
  return {
    accountName: setting?.bankAccountName || "",
    bankName: setting?.bankName || "",
    accountNumber: setting?.bankAccountNumber || "",
    ifsc: setting?.bankIfsc || "",
    upiId: setting?.companyUpiId || "",
    upiName: setting?.companyUpiName || "Royal Component",
  };
}

// PUBLIC: Checkout page payment methods
exports.getPaymentMethods = async (req, res) => {
  try {
    const amount = Number(req.query.amount || 0);

    const dbSetting = await PaymentSetting.findOne({ isActive: true }).sort({
      updatedAt: -1,
    });

    const bankDetails = dbSetting
      ? convertSettingToBankDetails(dbSetting)
      : getEnvBankDetails();

    const methods = [
      {
        id: "bank-transfer",
        label: "Bank Transfer / NEFT / RTGS / IMPS",
        description:
          "Order confirmation ke baad company bank account me payment karein.",
        recommended: true,
        enabled: true,
      },
      {
        id: "online-payment",
        label: "UPI / Card / Online Payment",
        description:
          "Company UPI, card machine ya manual online reference ke through payment.",
        recommended: false,
        enabled: true,
      },
      {
        id: "quote-request",
        label: "Request Quote",
        description:
          "Bulk quantity ke liye final price aur availability confirm karwayein.",
        recommended: amount >= 25000,
        enabled: true,
      },
      {
        id: "cod",
        label: "Cash / Pay on Delivery",
        description: "Selected locations aur small orders ke liye available.",
        recommended: false,
        enabled: amount <= 10000,
      },
    ];

    return res.status(200).json({
      success: true,
      methods,
      bankDetails,
    });
  } catch (error) {
    console.error("GET PAYMENT METHODS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Payment methods fetch failed",
    });
  }
};

// ADMIN: Get settings
exports.adminGetPaymentSettings = async (req, res) => {
  try {
    const dbSetting = await PaymentSetting.findOne({ isActive: true }).sort({
      updatedAt: -1,
    });

    return res.status(200).json({
      success: true,
      settings: dbSetting || null,
      fallback: getEnvBankDetails(),
    });
  } catch (error) {
    console.error("ADMIN GET PAYMENT SETTINGS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Payment settings fetch failed",
    });
  }
};

// ADMIN: Update settings
exports.adminUpdatePaymentSettings = async (req, res) => {
  try {
    const updated = await PaymentSetting.findOneAndUpdate(
      { isActive: true },
      {
        bankAccountName: req.body.bankAccountName || "",
        bankName: req.body.bankName || "",
        bankAccountNumber: req.body.bankAccountNumber || "",
        bankIfsc: req.body.bankIfsc || "",
        companyUpiId: req.body.companyUpiId || "",
        companyUpiName: req.body.companyUpiName || "",
        isActive: true,
      },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Payment settings updated successfully",
      settings: updated,
    });
  } catch (error) {
    console.error("ADMIN UPDATE PAYMENT SETTINGS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Payment settings update failed",
    });
  }
};