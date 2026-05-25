const PurchaseHistory = require("../models/PurchaseHistory");

exports.findSourceHistory = async (req, res) => {
  try {
    const { partNumber } = req.query;

    const history = await PurchaseHistory.find({
      partNumber,
    })
      .populate("supplierCompany")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      history,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Error fetching history",
    });
  }
};