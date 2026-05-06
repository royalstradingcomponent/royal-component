const ContactPage = require("../models/ContactPage");

const getContactPage = async (req, res) => {
  try {
    let page = await ContactPage.findOne({ isActive: true }).lean();

    if (!page) {
      page = await ContactPage.create({});
    }

    res.json({
      success: true,
      page,
    });
  } catch (error) {
    console.error("Get contact page error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load contact page",
    });
  }
};

const adminGetContactPage = async (req, res) => {
  try {
    let page = await ContactPage.findOne().lean();

    if (!page) {
      page = await ContactPage.create({});
    }

    res.json({
      success: true,
      page,
    });
  } catch (error) {
    console.error("Admin get contact page error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load contact page",
    });
  }
};

const adminUpdateContactPage = async (req, res) => {
  try {
    const payload = req.body || {};

    let page = await ContactPage.findOne();

    if (!page) {
      page = await ContactPage.create(payload);
    } else {
      Object.assign(page, payload);
      await page.save();
    }

    res.json({
      success: true,
      message: "Contact page updated successfully",
      page,
    });
  } catch (error) {
    console.error("Admin update contact page error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update contact page",
    });
  }
};

module.exports = {
  getContactPage,
  adminGetContactPage,
  adminUpdateContactPage,
};