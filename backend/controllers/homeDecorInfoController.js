const HomeDecorInfo = require("../models/HomeDecorInfo");
const Product = require("../models/Product");

exports.getHomeDecorInfo = async (req, res) => {
  try {
    let data = await HomeDecorInfo.findOne();

    if (!data) {
      data = await HomeDecorInfo.create({
        sectionTitle: "Trending & New Launches",
        products: [],
      });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.updateHomeDecorInfo = async (req, res) => {
  console.log("HOME DECOR SAVE HIT");
  console.log(req.body);


  try {
    if (req.body.products?.length) {

      const updatedProducts = await Promise.all(
        req.body.products.map(async (item) => {

          if (!item.sku) return item;

          const product = await Product.findOne({
            $or: [
              { sku: item.sku },
              { mpn: item.sku }
            ]
          });

          console.log("HOME DECOR SKU =", item.sku);

          console.log(
            "FOUND PRODUCT =",
            product?._id,
            product?.name,
            product?.slug
          );


          return {
            ...item,

            productId: product?._id,

            slug: product?.slug,

            buttonLink: product
              ? `/product/${product.slug}`
              : item.buttonLink,
          };
        })
      );

      req.body.products = updatedProducts;
    }

    const data = await HomeDecorInfo.findOneAndUpdate(
      {},
      req.body,
      {
        upsert: true,
        new: true,
      }
    );

    res.json(data);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

