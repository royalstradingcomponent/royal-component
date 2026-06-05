const AdminActivity =
    require("../models/AdminActivity");

module.exports = async ({
    req,
    admin,
    action,
    module,
    targetId = "",
    details = {}
}) => {

    try {

        const useragent = require("useragent");

        const agent = useragent.parse(
            req.headers["user-agent"] || ""
        );

        await AdminActivity.create({
            adminId: admin._id,

            adminName: admin.name,

            adminEmail: admin.email || "",

            action,

            module,

            description:
                details?.description || "",

            targetId,

            sessionId:
                req.headers["x-session-id"] || "",

            details,

            ipAddress:
                req.headers["x-forwarded-for"] ||
                req.socket.remoteAddress,

            browser: agent.family,

            browserVersion:
                agent.toVersion(),

            os: agent.os.family,

            osVersion:
                agent.os.toVersion(),
        });

    } catch (error) {
        console.log(error);
    }
};