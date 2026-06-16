const mongoose = require("mongoose");

const bannerItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },

    subtitle: {
      type: String,
      default: "",
    },

    desktopImage: {
      type: String,
      default: "",
    },

    mobileImage: {
      type: String,
      default: "",
    },

    buttonText: {
      type: String,
      default: "",
    },

    buttonLink: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const homepageBuilderSchema =
  new mongoose.Schema(
    {
      sectionName: {
        type: String,
        required: true,
      },

      sectionType: {
        type: String,
        enum: [
          "single-banner",
          "two-banner",
          "three-banner",
          "four-banner",
          "slider",
          "video-banner",
        ],
        required: true,
      },

      sortOrder: {
        type: Number,
        default: 0,
      },

      active: {
        type: Boolean,
        default: true,
      },

      banners: [bannerItemSchema],
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "HomepageBuilder",
  homepageBuilderSchema
);