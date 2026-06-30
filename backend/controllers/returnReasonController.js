const ReturnReason = require("../models/ReturnReason");

/* =====================================
   CREATE
===================================== */

exports.createReturnReason = async (req, res) => {
  try {
    const reason = await ReturnReason.create(req.body);

    res.status(201).json({
      success: true,
      reason,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================
   GET RETURN UI SETTINGS
===================================== */

exports.getReturnUISettings = async (req, res) => {
  try {
    let settings = await ReturnReason.findOne({
      type: "UI_SETTINGS",
      key: "return-ui",
    });

    if (!settings) {
      settings = await ReturnReason.create({
        title: "Return UI Settings",
        type: "UI_SETTINGS",
        key: "return-ui",

        uiSettings: {
          heading: "Return Product",
          subHeading:
            "Select reason and upload product evidence",

          stepLabels: [
            "Reason",
            "Issue",
            "Upload",
            "Details",
            "Review",
            "Submit",
          ],

          uploadImageTitle: "Upload Images",

          uploadImageSubtitle:
            "Upload clear photos of the issue",

          uploadVideoTitle:
            "Upload Video (Optional)",

          uploadVideoSubtitle:
            "Upload a short video",

          guidelineTitle:
            "Return Guidelines",

          guidelines: [
            "Return request within 24 hours.",
            "Original packaging required.",
            "Product should be unused.",
            "Support team will verify the request.",
          ],

          cancelButtonText: "Cancel",

          submitButtonText:
            "Submit Return Request",
        },
      });
    }

    res.json({
      success: true,
      settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================
   UPDATE RETURN UI SETTINGS
===================================== */

exports.updateReturnUISettings = async (
  req,
  res
) => {
  try {
    const settings =
      await ReturnReason.findOneAndUpdate(
        {
          type: "UI_SETTINGS",
          key: "return-ui",
        },
        {
          $set: req.body,
        },
        {
          new: true,
          upsert: true,
        }
      );

    res.json({
      success: true,
      settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================
   GET ALL
===================================== */

exports.getReturnReasons = async (req, res) => {
  try {
    const { type } = req.query;

    let filter = {
      isActive: true,
    };

    if (type) {
      filter.$or = [
        { type },
        { type: "BOTH" },
      ];
    }

    const reasons = await ReturnReason.find(filter)
      .sort({
        sortOrder: 1,
        createdAt: 1,
      });

    res.json({
      success: true,
      reasons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================
   ADMIN ALL
===================================== */

exports.adminGetReturnReasons = async (req, res) => {
  try {
    const reasons = await ReturnReason.find()
      .sort({
        sortOrder: 1,
      });

    res.json({
      success: true,
      reasons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================
   SINGLE
===================================== */

exports.getReturnReasonById = async (req, res) => {
  try {
    const reason = await ReturnReason.findById(
      req.params.id
    );

    if (!reason) {
      return res.status(404).json({
        success: false,
        message: "Reason not found",
      });
    }

    res.json({
      success: true,
      reason,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================
   UPDATE
===================================== */

exports.updateReturnReason = async (req, res) => {
  try {
    const reason =
     await ReturnReason.findByIdAndUpdate(
  req.params.id,
  {
    ...req.body,
  },
  {
    new: true,
    runValidators: true,
  }
);

    res.json({
      success: true,
      reason,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================
   DELETE
===================================== */

exports.deleteReturnReason = async (req, res) => {
  try {
    await ReturnReason.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================
   TOGGLE ACTIVE
===================================== */

exports.toggleReturnReason = async (req, res) => {
  try {
    const reason =
      await ReturnReason.findById(
        req.params.id
      );

    if (!reason) {
      return res.status(404).json({
        success: false,
        message: "Reason not found",
      });
    }

    reason.isActive =
      !reason.isActive;

    await reason.save();

    res.json({
      success: true,
      reason,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};