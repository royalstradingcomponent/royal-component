const CrmContact = require("../models/CrmContact");

exports.getContacts = async (
  req,
  res
) => {
  try {

    const contacts =
      await CrmContact.find()
        .sort({
          createdAt: -1,
        });

    res.json({
      success: true,
      contacts,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

exports.createContact =
  async (
    req,
    res
  ) => {

    try {

     const contact =
  await CrmContact.create({
    ...req.body,

    activities: [
      {
        title: "Contact Created",
        description:
          "New CRM contact added",
      },
    ],

    lastActivity:
      "Contact Created",
  });

      res.status(201).json({
        success: true,
        contact,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };

  exports.getContactById =
  async (req, res) => {
    try {

      const contact =
        await CrmContact.findById(
          req.params.id
        );

      if (!contact) {
        return res.status(404).json({
          success: false,
          message:
            "Contact not found",
        });
      }

      res.json({
        success: true,
        contact,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };

exports.updateContact =
  async (req, res) => {

    try {

      const contact =
        await CrmContact.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        );

      res.json({
        success: true,
        contact,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };

exports.deleteContact =
  async (req, res) => {

    try {

      await CrmContact.findByIdAndDelete(
        req.params.id
      );

      res.json({
        success: true,
        message:
          "Contact deleted",
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };