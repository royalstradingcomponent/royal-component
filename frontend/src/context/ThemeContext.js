"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { API_BASE } from "@/lib/api";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(null);

    const loadTheme = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/theme`, {
                cache: "no-store",
            });

            const data = await res.json();

            if (data?.theme) {
                setTheme(data.theme);

                const root = document.documentElement;

                root.style.setProperty("--theme-primary", data.theme.primary);
                root.style.setProperty(
                    "--theme-primary-hover",
                    data.theme.primaryHover,
                );

                root.style.setProperty(
                    "--theme-navbar-hover-color",
                    data.theme.navbarHoverColor
                );

                root.style.setProperty(
                    "--theme-navbar-logout-text",
                    data.theme.navbarLogoutText
                );

                root.style.setProperty(
                    "--theme-navbar-logout-hover-bg",
                    data.theme.navbarLogoutHoverBg
                );

                root.style.setProperty(
                    "--theme-mobile-overlay-bg",
                    data.theme.mobileOverlayBg
                );

                root.style.setProperty(
                    "--theme-navbar-shadow",
                    data.theme.navbarShadow
                );

                root.style.setProperty(
                    "--theme-mega-menu-shadow",
                    data.theme.megaMenuShadow
                );

                root.style.setProperty(
                    "--theme-account-menu-shadow",
                    data.theme.accountMenuShadow
                );

                root.style.setProperty("--theme-secondary", data.theme.secondary);

                root.style.setProperty("--theme-heading", data.theme.heading);

                root.style.setProperty("--theme-body", data.theme.body);

                root.style.setProperty("--theme-muted", data.theme.muted);

                root.style.setProperty("--theme-background", data.theme.background);

                root.style.setProperty(
                    "--theme-background-alt",
                    data.theme.backgroundAlt,
                );

                root.style.setProperty("--theme-navbar-bg", data.theme.navbarBg);
                root.style.setProperty("--theme-navbar-text", data.theme.navbarText);
                root.style.setProperty(
                    "--theme-navbar-border",
                    data.theme.navbarBorder,
                );

                root.style.setProperty(
                    "--theme-navbar-hover-color",
                    data.theme.navbarHoverColor
                );

                root.style.setProperty(
                    "--theme-navbar-logout-text",
                    data.theme.navbarLogoutText
                );

                root.style.setProperty(
                    "--theme-navbar-logout-hover-bg",
                    data.theme.navbarLogoutHoverBg
                );

                root.style.setProperty(
                    "--theme-mobile-overlay-bg",
                    data.theme.mobileOverlayBg
                );

                root.style.setProperty(
                    "--theme-navbar-shadow",
                    data.theme.navbarShadow
                );

                root.style.setProperty(
                    "--theme-mega-menu-shadow",
                    data.theme.megaMenuShadow
                );

                root.style.setProperty(
                    "--theme-account-menu-shadow",
                    data.theme.accountMenuShadow
                );

                root.style.setProperty("--theme-topbar-start", data.theme.topbarStart);

                root.style.setProperty(
                    "--theme-topbar-middle",
                    data.theme.topbarMiddle,
                );

                root.style.setProperty("--theme-topbar-end", data.theme.topbarEnd);

                root.style.setProperty("--theme-menu-bg", data.theme.menuBg);

                root.style.setProperty("--theme-menu-hover", data.theme.menuHover);

                root.style.setProperty("--theme-icon-color", data.theme.iconColor);

                root.style.setProperty("--theme-footer-bg", data.theme.footerBg);
                root.style.setProperty("--theme-footer-text", data.theme.footerText);
                root.style.setProperty(
                    "--theme-footer-border",
                    data.theme.footerBorder,
                );

                root.style.setProperty(
                    "--theme-footer-card-bg",
                    data.theme.footerCardBg,
                );

                root.style.setProperty(
                    "--theme-footer-card-border",
                    data.theme.footerCardBorder,
                );

                root.style.setProperty("--theme-hero-bg", data.theme.heroBg);
                root.style.setProperty("--theme-hero-text", data.theme.heroText);
                root.style.setProperty("--theme-hero-overlay", data.theme.heroOverlay);
                root.style.setProperty(
                    "--theme-hero-title-start",
                    data.theme.heroTitleStart,
                );

                root.style.setProperty(
                    "--theme-hero-title-middle",
                    data.theme.heroTitleMiddle,
                );

                root.style.setProperty(
                    "--theme-hero-title-end",
                    data.theme.heroTitleEnd,
                );

                root.style.setProperty("--theme-card-bg", data.theme.cardBg);
                root.style.setProperty("--theme-card-text", data.theme.cardText);
                root.style.setProperty("--theme-card-border", data.theme.cardBorder);
                root.style.setProperty("--theme-card-shadow", data.theme.cardShadow);

                root.style.setProperty("--theme-button-bg", data.theme.buttonBg);
                root.style.setProperty("--theme-button-text", data.theme.buttonText);
                root.style.setProperty("--theme-success", data.theme.success);

                root.style.setProperty("--theme-warning", data.theme.warning);

                root.style.setProperty("--theme-danger", data.theme.danger);

                root.style.setProperty(
                    "--theme-stock-success-bg",
                    data.theme.stockSuccessBg,
                );

                root.style.setProperty(
                    "--theme-stock-success-text",
                    data.theme.stockSuccessText,
                );

                root.style.setProperty(
                    "--theme-stock-warning-bg",
                    data.theme.stockWarningBg,
                );

                root.style.setProperty(
                    "--theme-stock-warning-text",
                    data.theme.stockWarningText,
                );

                root.style.setProperty(
                    "--theme-stock-danger-bg",
                    data.theme.stockDangerBg,
                );

                root.style.setProperty(
                    "--theme-stock-danger-text",
                    data.theme.stockDangerText,
                );

                root.style.setProperty(
                    "--theme-button-hover-bg",
                    data.theme.buttonHoverBg,
                );

                root.style.setProperty(
                    "--theme-button-hover-text",
                    data.theme.buttonHoverText,
                );

                root.style.setProperty("--theme-input-bg", data.theme.inputBg);
                root.style.setProperty("--theme-input-text", data.theme.inputText);

                root.style.setProperty("--theme-input-border", data.theme.inputBorder);

                root.style.setProperty("--theme-section-bg", data.theme.sectionBg);

                root.style.setProperty(
                    "--theme-product-card-bg",
                    data.theme.productCardBg,
                );

                root.style.setProperty(
                    "--theme-product-card-text",
                    data.theme.productCardText,
                );

                root.style.setProperty("--theme-wishlist-bg", data.theme.wishlistBg);

                root.style.setProperty(
                    "--theme-wishlist-text",
                    data.theme.wishlistText,
                );

                root.style.setProperty("--theme-badge-bg", data.theme.badgeBg);

                root.style.setProperty("--theme-badge-text", data.theme.badgeText);

                root.style.setProperty(
                    "--theme-admin-header-bg",
                    data.theme.adminHeaderBg,
                );

                root.style.setProperty(
                    "--theme-admin-header-text",
                    data.theme.adminHeaderText,
                );

                root.style.setProperty(
                    "--theme-admin-sidebar-bg",
                    data.theme.adminSidebarBg,
                );

                root.style.setProperty(
                    "--theme-admin-sidebar-text",
                    data.theme.adminSidebarText,
                );

                root.style.setProperty(
                    "--theme-admin-sidebar-active-bg",
                    data.theme.adminSidebarActiveBg,
                );

                root.style.setProperty(
                    "--theme-admin-sidebar-active-text",
                    data.theme.adminSidebarActiveText,
                );

                root.style.setProperty("--theme-link-color", data.theme.linkColor);

                root.style.setProperty(
                    "--theme-link-hover-color",
                    data.theme.linkHoverColor,
                );

                root.style.setProperty("--theme-price-color", data.theme.priceColor);

                root.style.setProperty("--theme-sale-badge-bg", data.theme.saleBadgeBg);

                root.style.setProperty(
                    "--theme-sale-badge-text",
                    data.theme.saleBadgeText,
                );

                root.style.setProperty(
                    "--theme-wishlist-icon-color",
                    data.theme.wishlistIconColor,
                );

                root.style.setProperty(
                    "--theme-cart-button-bg",
                    data.theme.cartButtonBg,
                );

                root.style.setProperty(
                    "--theme-cart-button-text",
                    data.theme.cartButtonText,
                );

                root.style.setProperty(
                    "--theme-buy-now-button-bg",
                    data.theme.buyNowButtonBg,
                );

                root.style.setProperty(
                    "--theme-buy-now-button-text",
                    data.theme.buyNowButtonText,
                );

                root.style.setProperty(
                    "--theme-gradient2-start",
                    data.theme.gradient2Start,
                );

                root.style.setProperty(
                    "--theme-gradient2-end",
                    data.theme.gradient2End,
                );

                root.style.setProperty(
                    "--theme-gradient3-start",
                    data.theme.gradient3Start,
                );

                root.style.setProperty(
                    "--theme-gradient3-end",
                    data.theme.gradient3End,
                );

                root.style.setProperty("--theme-surface", data.theme.surface);

                root.style.setProperty("--theme-border", data.theme.border);

                root.style.setProperty("--theme-sidebar", data.theme.sidebar);

                root.style.setProperty(
                    "--theme-sidebar-active",
                    data.theme.sidebarActive,
                );

                root.style.setProperty(
                    "--theme-gradient-start",
                    data.theme.gradientStart,
                );

                root.style.setProperty("--theme-gradient-end", data.theme.gradientEnd);

                root.style.setProperty("--theme-card-radius", data.theme.cardRadius);

                root.style.setProperty(
                    "--theme-button-radius",
                    data.theme.buttonRadius,
                );
            }
        } catch (error) {
            console.log("THEME LOAD ERROR", error);
        }
    };

    useEffect(() => {
        loadTheme();
    }, []);

    return (
        <ThemeContext.Provider
            value={{
                theme,
                loadTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
