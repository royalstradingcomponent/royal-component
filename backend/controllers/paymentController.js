exports.getPaymentMethods = async (req, res) => {
  try {
    const amount = Number(req.query.amount || 0);

    const methods = [
      {
        id: "bank-transfer",
        label: "Bank Transfer",
        description: "Pay via NEFT / RTGS / IMPS after order confirmation.",
        recommended: true,
        enabled: true,
      },
      {
        id: "quote-request",
        label: "Request Quote",
        description: "Submit order request and get final quote from sales team.",
        recommended: amount >= 25000,
        enabled: true,
      },
      {
        id: "online-payment",
        label: "Online Payment",
        description: "Pay securely using UPI, card or net banking.",
        recommended: false,
        enabled: true,
      },
      {
        id: "cod",
        label: "Pay on Delivery",
        description: "Available only for selected locations and smaller orders.",
        recommended: false,
        enabled: amount <= 10000,
      },
    ];

    return res.status(200).json({
      success: true,
      methods,
      bankDetails: {
        accountName: "Royal Component",
        bankName: "Add Bank Name",
        accountNumber: "Add Account Number",
        ifsc: "Add IFSC",
        upiId: "Add UPI ID",
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Payment methods fetch failed",
    });
  }
};