const VALID_PACKAGE_REGEX =
    /^(DIP|SOP|SOIC|QFN|QFP|LQFP|TQFP|BGA|SOT|TO|PLCC|MODULE|SMD|SMPS|HC49|SIP|RADIAL|POWER|DIP\d+|SOIC\d+|QFP\d+|TO\d+|QFN\d+)$/i;

const COMPONENT_REGEX = [
    /^[A-Z0-9\-]{4,}$/,

    /^[A-Z]{1,5}\d{2,}[A-Z0-9\-]*$/,

    /^\d+[A-Z]+\d+[A-Z0-9\-]*$/,

    /^[A-Z]{2,}\d+[A-Z0-9\-]*$/,
];

const INVALID_WORDS = [
    "private",
    "limited",
    "customer",
    "journey",
    "support",
    "global",
    "india",
    "company",
    "profile",
    "about",
    "welcome",
    "technology",
    "electronic",
    "electronics",
    "component",
    "components",
    "management",
    "solution",
    "industry",
    "market",
    "brands",
    "partner",
    "distribution",
    "overview",
    "headquartered",
    "mumbai",
    "maharashtra",
    "certified",
    "founded",
    "manufacturer",
    "exporter",
    "importer",
    "stockist",
    "sales",
    "contact",
    "address",
    "phone",
    "email",
    "website",
    "subject",
    "jurisdiction",
    "bank",
    "branch",
    "ifsc",
    "code",
    "beneficiary",
    "swift",
    "account",
    "number",
    "name",
    "igst",
    "cgst",
    "sgst",
    "thousand",
    "hundred",
    "paise",
    "zero",
    "only",
    "quotation",
    "invoice",
    "amount",
    "tax",
    "total",
    "rate",
    "hsn",
    "gstin",
    "udyam",
];

function isValidComponentName(
    text
) {

    if (!text) return false;

    const clean =
        text.trim();

    if (
        clean.length < 4 ||
        clean.length > 40
    ) {
        return false;
    }

    const lower =
        clean.toLowerCase();

    if (
        INVALID_WORDS.includes(lower)
    ) {
        return false;
    }

    if (
        /^[a-z]+$/.test(clean)
    ) {
        return false;
    }

    if (
        /^\d+$/.test(clean)
    ) {
        return false;
    }

    const hasLetter =
        /[A-Z]/i.test(clean);

    const hasNumber =
        /\d/.test(clean);

    if (
        !hasLetter ||
        !hasNumber
    ) {
        return false;
    }

    return COMPONENT_REGEX.some(
        (regex) =>
            regex.test(clean)
    );
}

function detectPackage(
    text = ""
) {

    const words =
        text.split(/\s+|\|/);

    for (const word of words) {

        const clean =
            word.trim();

        if (
            VALID_PACKAGE_REGEX.test(
                clean
            )
        ) {
            return clean.toUpperCase();
        }
    }

    return "NA";
}

function detectPrice(
    line = ""
) {

    const price =
        line.match(
            /\b\d{1,6}\b/g
        );

    if (!price) return 0;

    const numbers =
        price
            .map(Number)
            .filter(
                (n) =>
                    n > 0 &&
                    n < 100000
            );

    if (!numbers.length)
        return 0;

    return numbers[
        numbers.length - 1
    ];
}

function detectBrand(
    line = ""
) {

    const brands = [
        "TI",
        "NXP",
        "STM",
        "ST",
        "INFINEON",
        "MICROCHIP",
        "ATMEL",
        "ONSEMI",
        "FAIRCHILD",
        "TOSHIBA",
        "VISHAY",
        "OMRON",
        "BOURNS",
        "MEANWELL",
        "POWER",
        "DIODES",
    ];

    const upper =
        line.toUpperCase();

    for (const brand of brands) {

        if (
            upper.includes(brand)
        ) {
            return brand;
        }
    }

    return "GENERIC";
}

function extractComponents(
    lines = []
) {

    const bomComponents = [];

for (let i = 0; i < lines.length; i++) {

    const line = String(lines[i] || "").trim();

    if (
        line.toLowerCase().startsWith("component name:")
    ) {

        const componentName =
            line.split(":")[1]?.trim() || "";

        const partNumber =
            String(lines[i + 1] || "")
                .replace(/part number:/i, "")
                .trim();

        const brand =
            String(lines[i + 2] || "")
                .replace(/brand:/i, "")
                .trim();

        const quantity =
            Number(
                String(lines[i + 3] || "")
                    .replace(/quantity:/i, "")
                    .trim()
            ) || 1;

        bomComponents.push({
            componentName,
            partNumber,
            brand,
            quantity,
        });
    }
}

if (bomComponents.length > 0) {
    return bomComponents;
}

    const unique =
        new Set();

    const final = [];

    for (const rawLine of lines) {

        const line =
            rawLine
                .replace(/\s+/g, " ")
                .trim();

        if (!line) continue;

        const pipeParts =
            line.split("|");

        if (
            pipeParts.length >= 1
        ) {

            const possiblePart =
                pipeParts[0]
                    ?.trim();
            if (
                possiblePart.includes("@") ||
                possiblePart.includes("WHATSAPP") ||
                possiblePart.includes("CALL") ||
                possiblePart.includes("EMAIL")
            ) {
                continue;
            }

            if (
                isValidComponentName(
                    possiblePart
                )
            ) {

                if (
                    !unique.has(
                        possiblePart
                    )
                ) {

                    unique.add(
                        possiblePart
                    );

                    final.push({
                        componentName:
                            String(
                                possiblePart || ""
                            ).trim(),

                        brand:
                            pipeParts[1]
                                ?.trim() ||
                            detectBrand(
                                line
                            ),

                        package:
                            pipeParts[2]
                                ?.trim() ||
                            detectPackage(
                                line
                            ),

                        price:
                            Number(
                                pipeParts[3]
                            ) ||
                            detectPrice(
                                line
                            ),
                    });
                }

                continue;
            }
        }

        const words =
            line.split(/\s+/);
        if (
            line.toLowerCase().includes("jurisdiction") ||
            line.toLowerCase().includes("bank") ||
            line.toLowerCase().includes("gst") ||
            line.toLowerCase().includes("invoice") ||
            line.toLowerCase().includes("amount")
        ) {
            continue;
        }

        const componentCandidates =
            words.filter((word) =>
                isValidComponentName(
                    word
                )
            );

        if (
            componentCandidates
                .length === 0
        ) {
            continue;
        }

        for (const comp of componentCandidates) {

            if (
                unique.has(comp)
            ) {
                continue;
            }

            unique.add(comp);

const qtyMatch =
    line.match(/\b(\d{1,6})\b/g);

const detectedQty =
    qtyMatch?.length
        ? Number(
              qtyMatch[
                  qtyMatch.length - 1
              ]
          )
        : 1;

final.push({
    componentName: comp,

    partNumber: comp,

    brand:
        detectBrand(line),

    package:
        detectPackage(line),

    price:
        detectPrice(line),

    quantity:
        detectedQty > 0
            ? detectedQty
            : 1,
});
        }
    }

    return final;
}

module.exports = {
    extractComponents,
};