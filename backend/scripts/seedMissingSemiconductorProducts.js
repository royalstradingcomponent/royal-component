const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/Product");
const Category = require("../models/Category");

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI / MONGODB_URI not found");
  process.exit(1);
}

const normalize = (value = "") =>
  String(value).toLowerCase().trim().replace(/[^a-z0-9]/g, "");

const imageByKeyword = (name = "") => {
  const text = name.toLowerCase();

  if (text.includes("audio")) return "/uploads/new-products/TDA2030.jpg";
  if (text.includes("video")) return "/uploads/new-products/video-ic.jpg";
  if (text.includes("clock") || text.includes("timer")) return "/uploads/new-products/555-Timer-IC.jpg";
  if (text.includes("memory") || text.includes("eeprom")) return "/uploads/new-products/24C04-IC.jpg";
  if (text.includes("sensor")) return "/uploads/new-products/IR-Sensor.jpg";
  if (text.includes("wireless") || text.includes("bluetooth") || text.includes("wi-fi")) return "/uploads/new-products/Bluetooth-Module-HC-05.jpg";
  if (text.includes("interface")) return "/uploads/new-products/interface-modules.jpg";
  if (text.includes("logic")) return "/uploads/new-products/4050-IC.jpg";
  if (text.includes("power")) return "/uploads/new-products/LM339N-Comparator.jpg";
  if (text.includes("programmer")) return "/uploads/new-products/USB-Programming-Cable.jpg";

  return "/uploads/new-products/LM358.jpg";
};

const priceByIndex = (index) => {
  const prices = [18, 25, 32, 45, 60, 75, 95, 120];
  return prices[index % prices.length];
};

const makeSku = (slug, index) =>
  `SEM-${normalize(slug).toUpperCase().slice(0, 18)}-${String(index + 1).padStart(3, "0")}`;

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    const categories = await Category.find({
      group: "semiconductors",
      isActive: true,
      slug: { $ne: "semiconductors" },
    })
      .sort({ parentSlug: 1, order: 1 })
      .lean();

    console.log(`🔍 Found semiconductor categories: ${categories.length}`);

    let inserted = 0;
    let skipped = 0;

    for (const category of categories) {
      const normalizedSlug = normalize(category.slug);

      const existingCount = await Product.countDocuments({
        category: "semiconductors",
        subCategory: normalizedSlug,
        isActive: true,
        status: "published",
      });

      if (existingCount > 0) {
        skipped++;
        console.log(`⏭️ Already has products: ${category.name} / ${normalizedSlug}`);
        continue;
      }

      const image = category.image || imageByKeyword(category.name);

      const productsToCreate = Array.from({ length: 3 }).map((_, index) => {
        const price = priceByIndex(index);
        const mrp = Math.round(price * 1.35);

        return {
          name: `${category.name} ${index + 1}`,
          slug: `${normalizedSlug}-${index + 1}`,
          sku: makeSku(normalizedSlug, index),
          mpn: "",
          brand: "Generic",
          category: "semiconductors",
          subCategory: normalizedSlug,
          shortDescription: `${category.name} for industrial electronics, repair, automation and embedded hardware applications.`,
          description: `${category.name} component suitable for electronics projects, industrial control systems, PCB repair, embedded circuits and bulk procurement requirements.`,
          thumbnail: image,
          images: [
            {
              url: image,
              altText: `${category.name} product image`,
              isPrimary: true,
              order: 0,
            },
          ],
          specifications: [
            { key: "Category", value: category.name },
            { key: "Application", value: "Industrial electronics and embedded systems" },
            { key: "Condition", value: "New" },
          ],
          documents: [],
          price,
          mrp,
          discount: Math.round(((mrp - price) / mrp) * 100),
          stock: 100 + index * 25,
          moq: 1,
          unit: "piece",
          leadTimeDays: 2,
          countryOfOrigin: "India",
          warranty: "No Warranty",
          tags: [normalizedSlug, category.name.toLowerCase(), "semiconductors"],
          isFeatured: false,
          isBestSeller: false,
          isActive: true,
          status: "published",
          seo: {
            metaTitle: `${category.name} Online`,
            metaDescription: `Buy ${category.name} for industrial electronics and embedded applications.`,
            metaKeywords: [category.name, "semiconductors", normalizedSlug],
          },
        };
      });

      await Product.insertMany(productsToCreate, { ordered: false });

      inserted += productsToCreate.length;
      console.log(`✅ Added ${productsToCreate.length}: ${category.name} / ${normalizedSlug}`);
    }

    console.log("=================================");
    console.log(`✅ Inserted products: ${inserted}`);
    console.log(`⏭️ Skipped categories: ${skipped}`);
    console.log("=================================");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
}

run();