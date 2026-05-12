const mongoose = require("mongoose");

const paymentSettingSchema = new mongoose.Schema(
  {
    bankAccountName: { type: String, default: "", trim: true },
    bankName: { type: String, default: "", trim: true },
    bankAccountNumber: { type: String, default: "", trim: true },
    bankIfsc: { type: String, default: "", trim: true, uppercase: true },

    companyUpiId: { type: String, default: "", trim: true },
    companyUpiName: { type: String, default: "", trim: true },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.PaymentSetting ||
  mongoose.model("PaymentSetting", paymentSettingSchema);