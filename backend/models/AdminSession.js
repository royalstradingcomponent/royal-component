const mongoose = require("mongoose");

const adminSessionSchema = new mongoose.Schema(
    {
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        browser: String,
        os: String,

        deviceType: String,

        deviceName: String,

        platform: String,

        ipAddress: String,

        lastSeenAt: {
            type: Date,
            default: Date.now
        },

        loginAt: {
            type: Date,
            default: Date.now
        },

        logoutAt: Date,

        isActive: {
            type: Boolean,
            default: true
        },

        tokenVersion: {
            type: Number,
            default: 1
        },

    },
    {
        timestamps: true
    });

module.exports =
    mongoose.model(
        "AdminSession",
        adminSessionSchema
    );