const SecurityAlert =
  require("../models/SecurityAlert");

module.exports = async ({
  adminId,
  type,
  title,
  message,
  ipAddress = "",
  browser = "",
  os = "",
}) => {
  try {
    await SecurityAlert.create({
      adminId,
      type,
      title,
      message,
      ipAddress,
      browser,
      os,
    });
  } catch (error) {
    console.log(error);
  }
};