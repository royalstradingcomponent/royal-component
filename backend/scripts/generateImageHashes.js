const mongoose = require("mongoose");
const path = require("path");

const Product = require("../models/Product");
const { generateImageHash } = require("../utils/imageHash");

require("dotenv").config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const products = await Product.find();

  for (const product of products) {
    const hashes = [];

    const images = [];

    if (product.thumbnail) {
      images.push(product.thumbnail);
    }

    if (Array.isArray(product.images)) {
      product.images.forEach((img) => {
        if (img?.url) {
          images.push(img.url);
        }
      });
    }

    for (const img of images) {
      try {
        const cleanPath = img.startsWith("/")
          ? img.substring(1)
          : img;

        const fullPath = path.join(
          process.cwd(),
          cleanPath
        );

        const hash = await generateImageHash(fullPath);

        if (hash) {
          hashes.push({
            url: img,
            hash,
          });
        }
      } catch (e) {
        console.log(e.message);
      }
    }

    product.imageHashes = hashes;

    await product.save();

    console.log("DONE:", product.name);
  }

  console.log("ALL HASHES GENERATED");
  process.exit();
}

run();