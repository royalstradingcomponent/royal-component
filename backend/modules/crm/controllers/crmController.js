const CrmContact = require("../models/CrmContact");
const CrmConversation = require("../models/CrmConversation");
const CrmMessage = require("../models/CrmMessage");

exports.getDashboard = async (req, res) => {
  try {
    const [
      totalContacts,
      totalConversations,
      totalMessages,
    ] = await Promise.all([
      CrmContact.countDocuments(),
      CrmConversation.countDocuments(),
      CrmMessage.countDocuments(),
    ]);

    res.json({
      success: true,
      stats: {
        totalContacts,
        totalConversations,
        totalMessages,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const conversations =
      await CrmConversation.find()
        .populate("contact")
        .sort({ lastMessageAt: -1 });

    res.json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages =
      await CrmMessage.find({
        conversation: req.params.id,
      }).sort({
        createdAt: 1,
      });

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.seedData = async (req, res) => {
  try {

    const contact =
      await CrmContact.create({
        name: "Mahadev Electronics",
        phone: "9898989898",
        email: "mahadev@gmail.com",
        company: "Mahadev Electronics",
      });

    const conversation =
      await CrmConversation.create({
        contact: contact._id,
        lastMessage:
          "Need STM32 quotation",
        lastMessageAt: new Date(),
      });

    await CrmMessage.create({
      conversation:
        conversation._id,

      contact:
        contact._id,

      direction:
        "incoming",

      message:
        "Need STM32 quotation",
    });

    await CrmMessage.create({
      conversation:
        conversation._id,

      contact:
        contact._id,

      direction:
        "outgoing",

      message:
        "Please share quantity",
    });

    res.json({
      success: true,
      message:
        "CRM seed created",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};