const AboutPage = require("../models/AboutPage");

const getOrCreateAboutPage = async () => {
  let page = await AboutPage.findOne();
  if (!page) {
    page = await AboutPage.create({});
  }
  return page;
};

exports.getAboutPage = async (req, res) => {
  try {
    const page = await getOrCreateAboutPage();
    res.json({ success: true, page });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load about page",
      error: error.message,
    });
  }
};

exports.adminGetAboutPage = async (req, res) => {
  try {
    const page = await getOrCreateAboutPage();
    res.json({ success: true, page });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load admin about page",
      error: error.message,
    });
  }
};

exports.adminUpdateAboutPage = async (req, res) => {
  try {
    const page = await getOrCreateAboutPage();

    const updated = await AboutPage.findByIdAndUpdate(page._id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: "About page updated successfully",
      page: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update about page",
      error: error.message,
    });
  }
};