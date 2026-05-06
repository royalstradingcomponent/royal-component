exports.getPaymentMethods = async (req, res) => {
  try {
    const amount = Number(req.query.amount || 0);

    const methods = [
      {
        id: "bank-transfer",
        label: "Bank Transfer / NEFT / RTGS / IMPS",
        description: "Order confirmation ke baad company bank account me payment karein.",
        recommended: true,
        enabled: true,
      },
      {
        id: "online-payment",
        label: "UPI / Card / Online Payment",
        description: "Company UPI, card machine ya manual online reference ke through payment.",
        recommended: false,
        enabled: true,
      },
      {
        id: "quote-request",
        label: "Request Quote",
        description: "Bulk quantity ke liye final price aur availability confirm karwayein.",
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
      bankDetails: {
        accountName: process.env.BANK_ACCOUNT_NAME || "Royal Component",
        bankName: process.env.BANK_NAME || "",
        accountNumber: process.env.BANK_ACCOUNT_NUMBER || "",
        ifsc: process.env.BANK_IFSC || "",
        upiId: process.env.COMPANY_UPI_ID || "",
        upiName: process.env.COMPANY_UPI_NAME || "Royal Component",
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Payment methods fetch failed",
    });
  }
};