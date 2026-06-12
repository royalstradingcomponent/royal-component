"use client";

import { useEffect, useState } from "react";
import { adminRequest } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function ThemeManagerPage() {
    const [theme, setTheme] = useState({});
    const [loading, setLoading] = useState(false);

    const loadTheme = async () => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/theme`
            );

            const data = await res.json();

            if (data?.theme) {
                setTheme(data.theme);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        loadTheme();
    }, []);

    const saveTheme = async () => {
        try {
            setLoading(true);

            await adminRequest("/api/theme", {
                method: "PUT",
                body: JSON.stringify(theme),
            });

            toast.success("Theme Saved");
        } catch (err) {
            toast.error("Save Failed");
        } finally {
            setLoading(false);
        }
    };

    const renderColor = (label, key) => (
        <div className="space-y-2">
            <label className="font-medium text-sm">
                {label}
            </label>

            <div className="flex gap-3 items-center">
                <input
                    type="color"
                    value={theme[key] || "#ffffff"}
                    onChange={(e) =>
                        setTheme({
                            ...theme,
                            [key]: e.target.value,
                        })
                    }
                    className="h-12 w-16"
                />

                <input
                    value={theme[key] || ""}
                    onChange={(e) =>
                        setTheme({
                            ...theme,
                            [key]: e.target.value,
                        })
                    }
                    className="border rounded-lg px-3 py-2 w-full"
                />
            </div>
        </div>
    );

    return (
        <div className="p-6 space-y-6">

            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">
                    Advanced Theme Manager
                </h1>

                <button
                    onClick={saveTheme}
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl"
                >
                    {loading ? "Saving..." : "Save Theme"}
                </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">

                {renderColor("Primary", "primary")}
                {renderColor("Primary Hover", "primaryHover")}
                {renderColor("Secondary", "secondary")}

                {renderColor("Heading", "heading")}
                {renderColor("Body Text", "body")}
                {renderColor("Muted Text", "muted")}

                {renderColor("Background", "background")}
                {renderColor("Background Alt", "backgroundAlt")}
                {renderColor("Surface", "surface")}

                {renderColor("Border", "border")}
                {renderColor("Sidebar", "sidebar")}
                {renderColor("Sidebar Active", "sidebarActive")}

                {renderColor("Success", "success")}
                {renderColor("Warning", "warning")}
                {renderColor("Danger", "danger")}

                {renderColor("Stock Success BG", "stockSuccessBg")}
                {renderColor("Stock Success Text", "stockSuccessText")}

                {renderColor("Stock Warning BG", "stockWarningBg")}
                {renderColor("Stock Warning Text", "stockWarningText")}

                {renderColor("Stock Danger BG", "stockDangerBg")}
                {renderColor("Stock Danger Text", "stockDangerText")}

                {renderColor("Info", "info")}
                {renderColor("Gradient Start", "gradientStart")}
                {renderColor("Gradient End", "gradientEnd")}

                {renderColor("Navbar BG", "navbarBg")}
                {renderColor("Navbar Text", "navbarText")}
                {renderColor("Navbar Border", "navbarBorder")}
                {renderColor("Navbar Hover Color", "navbarHoverColor")}

                {renderColor("Navbar Logout Text", "navbarLogoutText")}

                {renderColor("Navbar Logout Hover BG", "navbarLogoutHoverBg")}

                {renderColor("Mobile Overlay BG", "mobileOverlayBg")}

                {renderColor("Navbar Shadow", "navbarShadow")}

                {renderColor("Mega Menu Shadow", "megaMenuShadow")}

                {renderColor("Account Menu Shadow", "accountMenuShadow")}
                
                {renderColor("Topbar Start", "topbarStart")}
                {renderColor("Topbar Middle", "topbarMiddle")}
                {renderColor("Topbar End", "topbarEnd")}

                {renderColor("Menu BG", "menuBg")}
                {renderColor("Menu Hover", "menuHover")}
                {renderColor("Icon Color", "iconColor")}

                {renderColor("Footer BG", "footerBg")}
                {renderColor("Footer Text", "footerText")}
                {renderColor("Footer Card BG", "footerCardBg")}
                {renderColor("Footer Card Border", "footerCardBorder")}
                {renderColor("Footer Border", "footerBorder")}

                {renderColor("Hero BG", "heroBg")}
                {renderColor("Hero Text", "heroText")}
                {renderColor("Hero Overlay", "heroOverlay")}
                {renderColor("Hero Title Start", "heroTitleStart")}
                {renderColor("Hero Title Middle", "heroTitleMiddle")}
                {renderColor("Hero Title End", "heroTitleEnd")}

                {renderColor("Card BG", "cardBg")}
                {renderColor("Card Text", "cardText")}
                {renderColor("Card Border", "cardBorder")}

                {renderColor("Button BG", "buttonBg")}
                {renderColor("Button Text", "buttonText")}
                {renderColor("Button Hover BG", "buttonHoverBg")}

                {renderColor("Button Hover Text", "buttonHoverText")}
                {renderColor("Input BG", "inputBg")}
                {renderColor("Input Text", "inputText")}

                {renderColor("Input Border", "inputBorder")}
                {renderColor("Section BG", "sectionBg")}
                {renderColor("Product Card BG", "productCardBg")}

                {renderColor("Product Card Text", "productCardText")}
                {renderColor("Wishlist BG", "wishlistBg")}
                {renderColor("Wishlist Text", "wishlistText")}

                {renderColor("Badge BG", "badgeBg")}
                {renderColor("Badge Text", "badgeText")}
                {renderColor("Link Color", "linkColor")}

                {renderColor("Link Hover", "linkHoverColor")}
                {renderColor("Price Color", "priceColor")}
                {renderColor("Sale Badge BG", "saleBadgeBg")}

                {renderColor("Sale Badge Text", "saleBadgeText")}
                {renderColor("Wishlist Icon", "wishlistIconColor")}
                {renderColor("Cart Button BG", "cartButtonBg")}

                {renderColor("Cart Button Text", "cartButtonText")}
                {renderColor("Buy Now BG", "buyNowButtonBg")}
                {renderColor("Buy Now Text", "buyNowButtonText")}

                {renderColor("Gradient 2 Start", "gradient2Start")}
                {renderColor("Gradient 2 End", "gradient2End")}
                {renderColor("Gradient 3 Start", "gradient3Start")}

                {renderColor("Gradient 3 End", "gradient3End")}
            </div>
        </div>
    );
}