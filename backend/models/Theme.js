const mongoose = require("mongoose");

const themeSchema = new mongoose.Schema(
  {
    primary: {
      type: String,
      default: "#287cc6",
    },

    primaryHover: {
      type: String,
      default: "#1f80a9",
    },

    secondary: {
      type: String,
      default: "#102033",
    },

    heading: {
      type: String,
      default: "#102033",
    },

    body: {
      type: String,
      default: "#475569",
    },

    muted: {
      type: String,
      default: "#64748b",
    },

    background: {
      type: String,
      default: "#eef7ff",
    },

    backgroundAlt: {
      type: String,
      default: "#eef3f8",
    },

    surface: {
      type: String,
      default: "#ffffff",
    },

    border: {
      type: String,
      default: "#dbe3ee",
    },

    sidebar: {
      type: String,
      default: "#102033",
    },

    sidebarActive: {
      type: String,
      default: "#2454b5",
    },

    success: {
      type: String,
      default: "#22c55e",
    },

    warning: {
      type: String,
      default: "#f59e0b",
    },

    danger: {
      type: String,
      default: "#ef4444",
    },

    stockSuccessBg: {
  type: String,
  default: "#e8f8ee",
},

stockSuccessText: {
  type: String,
  default: "#0f8a4b",
},

stockWarningBg: {
  type: String,
  default: "#fff4e5",
},

stockWarningText: {
  type: String,
  default: "#c26a00",
},

stockDangerBg: {
  type: String,
  default: "#fee2e2",
},

stockDangerText: {
  type: String,
  default: "#b91c1c",
},

    info: {
      type: String,
      default: "#3b82f6",
    },

    gradientStart: {
      type: String,
      default: "#2563eb",
    },

    gradientEnd: {
      type: String,
      default: "#2454b5",
    },

    cardRadius: {
      type: String,
      default: "18px",
    },

    navbarBg: {
      type: String,
      default: "#ffffff",
    },

    navbarText: {
      type: String,
      default: "#102033",
    },
    navbarHoverColor: {
  type: String,
  default: "#38bdf8",
},

navbarLogoutText: {
  type: String,
  default: "#d14c5e",
},

navbarLogoutHoverBg: {
  type: String,
  default: "#fff3f5",
},

mobileOverlayBg: {
  type: String,
  default: "rgba(15,23,42,0.40)",
},

navbarShadow: {
  type: String,
  default: "rgba(15,23,42,0.06)",
},

megaMenuShadow: {
  type: String,
  default: "rgba(15,23,42,0.18)",
},

accountMenuShadow: {
  type: String,
  default: "rgba(15,23,42,0.16)",
},

    footerBg: {
      type: String,
      default: "#102033",
    },

    footerText: {
      type: String,
      default: "#ffffff",
    },

    footerCardBg: {
      type: String,
      default: "rgba(255,255,255,.04)",
    },

    footerCardBorder: {
      type: String,
      default: "rgba(255,255,255,.10)",
    },

    heroBg: {
      type: String,
      default: "#2454b5",
    },

    heroText: {
      type: String,
      default: "#ffffff",
    },
    heroTitleStart: {
      type: String,
      default: "#06152f",
    },

    heroTitleMiddle: {
      type: String,
      default: "#0f5f99",
    },

    heroTitleEnd: {
      type: String,
      default: "#1296db",
    },

    cardBg: {
      type: String,
      default: "#ffffff",
    },

    cardText: {
      type: String,
      default: "#102033",
    },

    buttonBg: {
      type: String,
      default: "#287cc6",
    },

    buttonText: {
      type: String,
      default: "#ffffff",
    },

    buttonHoverBg: {
      type: String,
      default: "#1f80a9",
    },

    buttonHoverText: {
      type: String,
      default: "#ffffff",
    },

    inputBg: {
      type: String,
      default: "#ffffff",
    },

    inputText: {
      type: String,
      default: "#102033",
    },

    inputBorder: {
      type: String,
      default: "#dbe3ee",
    },

    sectionBg: {
      type: String,
      default: "#eef7ff",
    },

    productCardBg: {
      type: String,
      default: "#ffffff",
    },

    productCardText: {
      type: String,
      default: "#102033",
    },

    wishlistBg: {
      type: String,
      default: "#ffffff",
    },

    wishlistText: {
      type: String,
      default: "#102033",
    },

    badgeBg: {
      type: String,
      default: "#22c55e",
    },

    badgeText: {
      type: String,
      default: "#ffffff",
    },

    adminHeaderBg: {
      type: String,
      default: "#ffffff",
    },

    adminHeaderText: {
      type: String,
      default: "#102033",
    },

    adminSidebarBg: {
      type: String,
      default: "#102033",
    },

    adminSidebarText: {
      type: String,
      default: "#ffffff",
    },

    adminSidebarActiveBg: {
      type: String,
      default: "#2454b5",
    },

    adminSidebarActiveText: {
      type: String,
      default: "#ffffff",
    },

    navbarBorder: {
      type: String,
      default: "#dbe3ee",
    },



    footerBorder: {
      type: String,
      default: "#1e293b",
    },

    heroOverlay: {
      type: String,
      default: "#00000040",
    },

    cardBorder: {
      type: String,
      default: "#dbe3ee",
    },

    cardShadow: {
      type: String,
      default: "rgba(15,23,42,0.08)",
    },

    linkColor: {
      type: String,
      default: "#287cc6",
    },

    linkHoverColor: {
      type: String,
      default: "#1f80a9",
    },

    priceColor: {
      type: String,
      default: "#22c55e",
    },

    saleBadgeBg: {
      type: String,
      default: "#ef4444",
    },

    saleBadgeText: {
      type: String,
      default: "#ffffff",
    },

    wishlistIconColor: {
      type: String,
      default: "#ef4444",
    },

    cartButtonBg: {
      type: String,
      default: "#287cc6",
    },

    cartButtonText: {
      type: String,
      default: "#ffffff",
    },

    buyNowButtonBg: {
      type: String,
      default: "#22c55e",
    },

    buyNowButtonText: {
      type: String,
      default: "#ffffff",
    },

    gradient2Start: {
      type: String,
      default: "#7c3aed",
    },

    gradient2End: {
      type: String,
      default: "#2563eb",
    },

    gradient3Start: {
      type: String,
      default: "#06b6d4",
    },

    gradient3End: {
      type: String,
      default: "#8b5cf6",
    },

    topbarStart: {
      type: String,
      default: "#0f6cbd",
    },

    topbarMiddle: {
      type: String,
      default: "#1792e8",
    },

    topbarEnd: {
      type: String,
      default: "#38bdf8",
    },

    menuBg: {
      type: String,
      default: "#eaf7ff",
    },

    menuHover: {
      type: String,
      default: "#dff2ff",
    },

    iconColor: {
      type: String,
      default: "#0f6cbd",
    },

    buttonRadius: {
      type: String,
      default: "9999px",
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Theme ||
  mongoose.model("Theme", themeSchema);