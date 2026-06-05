const AuditTrail = require("../models/AuditTrail");

module.exports = async ({
  req,
  admin,
  module,
  action,
  targetId = "",
  oldData = {},
  newData = {},
}) => {
  try {
    const changedFields = [];

    if (
      action === "UPDATE" &&
      oldData &&
      newData
    ) {
      const keys = new Set([
        ...Object.keys(oldData),
        ...Object.keys(newData),
      ]);

      for (const key of keys) {
        const oldValue =
          JSON.stringify(oldData[key]);

        const newValue =
          JSON.stringify(newData[key]);

        if (oldValue !== newValue) {
          changedFields.push({
            field: key,
            oldValue: oldData[key],
            newValue: newData[key],
          });
        }
      }
    }

    await AuditTrail.create({
      adminId: admin?._id,
      adminName: admin?.name,

      module,
      action,

      targetId,

      oldData,
      newData,

      changedFields,

      ipAddress:
        req.headers["x-forwarded-for"] ||
        req.socket.remoteAddress,

      sessionId:
        req.headers["x-session-id"] || "",
    });
  } catch (error) {
    console.log(
      "AUDIT SERVICE ERROR",
      error
    );
  }
};