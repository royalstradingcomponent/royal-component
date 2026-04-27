const User = require("../models/User");

/* ===============================
   ADD ADDRESS
   POST /api/users/address
=============================== */
exports.addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const {
      fullName,
      phone,
      altPhone,
      pincode,
      city,
      state,
      addressLine,
      landmark,
      addressType,
      isDefault,
    } = req.body;

    const missingFields = [];

    if (!fullName) missingFields.push("fullName");
    if (!phone) missingFields.push("phone");
    if (!pincode) missingFields.push("pincode");
    if (!city) missingFields.push("city");
    if (!state) missingFields.push("state");
    if (!addressLine) missingFields.push("addressLine");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    if (!/^[6-9]\d{9}$/.test(String(phone))) {
      return res.status(400).json({
        success: false,
        message: "Valid 10 digit phone number required",
      });
    }

    if (altPhone && !/^[6-9]\d{9}$/.test(String(altPhone))) {
      return res.status(400).json({
        success: false,
        message: "Valid alternate phone number required",
      });
    }

    if (!/^\d{6}$/.test(String(pincode))) {
      return res.status(400).json({
        success: false,
        message: "Valid 6 digit pincode required",
      });
    }

    if (!user.addresses) user.addresses = [];

    const shouldBeDefault = user.addresses.length === 0 || Boolean(isDefault);

    if (shouldBeDefault) {
      user.addresses.forEach((address) => {
        address.isDefault = false;
      });
    }

    user.addresses.push({
      fullName: fullName.trim(),
      phone: String(phone).trim(),
      altPhone: altPhone ? String(altPhone).trim() : "",
      pincode: String(pincode).trim(),
      city: city.trim(),
      state: state.trim(),
      addressLine: addressLine.trim(),
      landmark: landmark ? landmark.trim() : "",
      addressType: addressType || "OFFICE",
      isDefault: shouldBeDefault,
    });

    user.lastActivity = new Date();
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("ADD ADDRESS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Add address failed",
    });
  }
};

/* ===============================
   GET ADDRESSES
   GET /api/users/address
=============================== */
exports.getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("addresses");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const addresses = [...(user.addresses || [])].sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return 0;
    });

    return res.status(200).json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.error("GET ADDRESSES ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Address fetch failed",
    });
  }
};

/* ===============================
   UPDATE ADDRESS
   PUT /api/users/address/:id
=============================== */
exports.updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const address = user.addresses.id(req.params.id);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    const allowedFields = [
      "fullName",
      "phone",
      "altPhone",
      "pincode",
      "city",
      "state",
      "addressLine",
      "landmark",
      "addressType",
      "isDefault",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        address[field] = req.body[field];
      }
    });

    if (address.phone && !/^[6-9]\d{9}$/.test(String(address.phone))) {
      return res.status(400).json({
        success: false,
        message: "Valid 10 digit phone number required",
      });
    }

    if (address.altPhone && !/^[6-9]\d{9}$/.test(String(address.altPhone))) {
      return res.status(400).json({
        success: false,
        message: "Valid alternate phone number required",
      });
    }

    if (address.pincode && !/^\d{6}$/.test(String(address.pincode))) {
      return res.status(400).json({
        success: false,
        message: "Valid 6 digit pincode required",
      });
    }

    if (req.body.isDefault === true) {
      user.addresses.forEach((item) => {
        item.isDefault = item._id.toString() === req.params.id;
      });
    }

    user.lastActivity = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("UPDATE ADDRESS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Address update failed",
    });
  }
};

/* ===============================
   DELETE ADDRESS
   DELETE /api/users/address/:id
=============================== */
exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const exists = user.addresses.id(req.params.id);

    if (!exists) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    user.addresses = user.addresses.filter(
      (address) => address._id.toString() !== req.params.id
    );

    if (
      user.addresses.length > 0 &&
      !user.addresses.some((address) => address.isDefault)
    ) {
      user.addresses[0].isDefault = true;
    }

    user.lastActivity = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("DELETE ADDRESS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Address delete failed",
    });
  }
};

/* ===============================
   SET DEFAULT ADDRESS
   PATCH /api/users/address/default/:id
=============================== */
exports.setDefaultAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const address = user.addresses.id(req.params.id);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    user.addresses.forEach((item) => {
      item.isDefault = item._id.toString() === req.params.id;
    });

    user.lastActivity = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Default address updated",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("SET DEFAULT ADDRESS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Default update failed",
    });
  }
};