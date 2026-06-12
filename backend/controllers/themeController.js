const Theme = require("../models/Theme");

/* ==========================
   GET ACTIVE THEME
========================== */
exports.getTheme = async (req, res) => {
  try {
    let theme = await Theme.findOne();

    if (!theme) {
      theme = await Theme.create({});
    }

    res.status(200).json({
      success: true,
      theme,
    });
  } catch (error) {
    console.error("GET THEME ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load theme",
    });
  }
};

/* ==========================
   UPDATE THEME
========================== */
exports.updateTheme = async (req, res) => {
  try {
    let theme = await Theme.findOne();

    if (!theme) {
      theme = await Theme.create({});
    }

    Object.assign(theme, req.body);

    await theme.save();

    res.status(200).json({
      success: true,
      message: "Theme updated successfully",
      theme,
    });
  } catch (error) {
    console.error("UPDATE THEME ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update theme",
    });
  }
};

/* ==========================
   RESET DEFAULT THEME
========================== */
exports.resetTheme = async (req, res) => {
  try {
    await Theme.deleteMany({});

    const theme = await Theme.create({});

    res.status(200).json({
      success: true,
      message: "Theme reset successfully",
      theme,
    });
  } catch (error) {
    console.error("RESET THEME ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to reset theme",
    });
  }
};