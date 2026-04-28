const Cart = require("../models/cart");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");

const DEFAULT_GST_PERCENT = 18;

const toNumber = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const buildCartItemFromProduct = (product, qty = 1) => {
  const price = toNumber(product.price, 0);
  const mrp = toNumber(product.mrp, price);
  const gstPercent = DEFAULT_GST_PERCENT;

  return {
    product: product._id,
    qty: Math.max(1, toNumber(qty, 1)),
    nameSnapshot: product.name || "",
    brandSnapshot: product.brand || "Generic",
    skuSnapshot: product.sku || "",
    mpnSnapshot: product.mpn || "",
    imageSnapshot:
      product.thumbnail ||
      product.images?.find((img) => img?.isPrimary)?.url ||
      product.images?.[0]?.url ||
      "",
    slugSnapshot: product.slug || "",
    priceSnapshot: price,
    mrpSnapshot: mrp,
    gstPercent,
    hsnCode: product.hsnCode || "",
  };
};

const formatCartItem = (item, liveProduct) => {
  const price = toNumber(item.priceSnapshot, 0);
  const mrp = toNumber(item.mrpSnapshot, price);
  const qty = Math.max(1, toNumber(item.qty, 1));
  const gstPercent = toNumber(item.gstPercent, DEFAULT_GST_PERCENT);

  const lineSubtotal = price * qty;
  const gstAmount = (lineSubtotal * gstPercent) / 100;
  const lineTotal = lineSubtotal + gstAmount;

  return {
    id: item._id,
    productId: liveProduct?._id || item.product,
    slug: liveProduct?.slug || item.slugSnapshot || "",
    name: liveProduct?.name || item.nameSnapshot || "",
    brand: liveProduct?.brand || item.brandSnapshot || "Generic",
    sku: liveProduct?.sku || item.skuSnapshot || "",
    mpn: liveProduct?.mpn || item.mpnSnapshot || "",
    image:
      liveProduct?.thumbnail ||
      liveProduct?.images?.find((img) => img?.isPrimary)?.url ||
      liveProduct?.images?.[0]?.url ||
      item.imageSnapshot ||
      "",
    price,
    mrp,
    quantity: qty,
    gstPercent,
    gstAmount,
    lineSubtotal,
    lineTotal,
    stock: toNumber(liveProduct?.stock, 0),
    hsnCode: item.hsnCode || "",
    estimatedDelivery: "2-5 business days",
    stockLabel: toNumber(liveProduct?.stock, 0) > 0 ? "In stock" : "Out of stock",
  };
};

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name slug brand sku mpn thumbnail images stock price mrp hsnCode"
    );

    if (!cart) {
      return res.status(200).json({
        success: true,
        items: [],
        summary: {
          itemCount: 0,
          subtotalExGst: 0,
          gstTotal: 0,
          shipping: 0,
          grandTotal: 0,
        },
      });
    }

    const formattedItems = cart.items
      .filter((item) => item.product)
      .map((item) => formatCartItem(item, item.product));

    const subtotalExGst = formattedItems.reduce(
  (sum, item) => sum + item.lineSubtotal,
  0
);

const gstTotal = formattedItems.reduce(
  (sum, item) => sum + item.gstAmount,
  0
);
    

    let shipping = 0;

// 🔥 DELIVERY RULE
if (subtotalExGst < 5000) {
  shipping = 150; // 👈 tum change kar sakti ho (₹100 / ₹200)
} else {
  shipping = 0;
}
    const itemCount = formattedItems.reduce((sum, item) => sum + item.quantity, 0);

    const discount = cart.coupon?.isApplied
      ? Math.min(Number(cart.coupon.discountAmount || 0), subtotalExGst)
      : 0;

    const grandTotal = Math.max(0, subtotalExGst + gstTotal + shipping - discount);

    return res.status(200).json({
  success: true,
  items: formattedItems,
  summary: {
    itemCount,
    subtotalExGst,
    gstTotal,
    shipping,
    discount,
    grandTotal,
    deliveryMessage:
      subtotalExGst >= 5000
        ? "FREE delivery"
        : "₹150 delivery charge (Free above ₹5000)",
    coupon: cart.coupon || null,
  },
});
  } catch (error) {
    console.error("GET CART ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Cart fetch failed",
    });
  }
};

exports.addItemToCart = async (req, res) => {
  try {
    const { productId, qty = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await Product.findById(productId);

    if (!product || !product.isActive || product.status !== "published") {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId.toString()
    );

    if (existingItem) {
      existingItem.qty += Math.max(1, toNumber(qty, 1));
    } else {
      cart.items.push(buildCartItemFromProduct(product, qty));
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item added to cart",
    });
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Add to cart failed",
    });
  }
};

exports.mergeGuestCart = async (req, res) => {
  try {
    const incomingItems = Array.isArray(req.body?.items) ? req.body.items : [];

    if (incomingItems.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No guest cart items to merge",
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
      });
    }

    for (const incomingItem of incomingItems) {
      const productId = incomingItem?.productId;
      const qty = Math.max(1, toNumber(incomingItem?.qty, 1));

      if (!productId) continue;

      const product = await Product.findById(productId);

      if (!product || !product.isActive || product.status !== "published") {
        continue;
      }

      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId.toString()
      );

      if (existingItem) {
        existingItem.qty += qty;
      } else {
        cart.items.push(buildCartItemFromProduct(product, qty));
      }
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Guest cart merged successfully",
    });
  } catch (error) {
    console.error("MERGE GUEST CART ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Guest cart merge failed",
    });
  }
};

exports.updateQty = async (req, res) => {
  try {
    const { itemId } = req.params;

    // 🔥 FIX: dono accept karo
    const incomingQty = req.body.quantity ?? req.body.qty;

    const qty = Math.max(1, toNumber(incomingQty, 1));

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    item.qty = qty;

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Quantity updated",
    });
  } catch (error) {
    console.error("UPDATE CART QTY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Quantity update failed",
    });
  }
};

exports.deleteItemFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    console.error("REMOVE CART ITEM ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Remove item failed",
    });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart already empty",
      });
    }

    cart.items = [];
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    console.error("CLEAR CART ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Clear cart failed",
    });
  }
};
exports.applyCouponToCart = async (req, res) => {
  try {
    const code = String(req.body.code || "").trim().toUpperCase();

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Coupon code required",
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const now = new Date();

    const coupon = await Coupon.findOne({
      code,
      isActive: true,
      $or: [{ expiresAt: null }, { expiresAt: { $gte: now } }],
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired coupon",
      });
    }

    const itemCount = cart.items.reduce(
      (sum, item) => sum + Math.max(1, Number(item.qty || 1)),
      0
    );

    const subtotalExGst = cart.items.reduce((sum, item) => {
      const price = Number(item.priceSnapshot || 0);
      const qty = Math.max(1, Number(item.qty || 1));
      return sum + price * qty;
    }, 0);

    const minOrderAmount = Number(coupon.minOrderAmount || 0);

    // आपकी condition: 500 items OR ₹10000+ shopping
    if (itemCount < 500 && subtotalExGst < Math.max(10000, minOrderAmount)) {
      return res.status(400).json({
        success: false,
        message: "Coupon 500+ units ya ₹10,000+ shopping par valid hai.",
      });
    }

    let discountAmount = 0;

    if (coupon.discountType === "percentage") {
      discountAmount = (subtotalExGst * Number(coupon.discountValue || 0)) / 100;

      if (Number(coupon.maxDiscount || 0) > 0) {
        discountAmount = Math.min(discountAmount, Number(coupon.maxDiscount));
      }
    } else {
      discountAmount = Number(coupon.discountValue || 0);
    }

    discountAmount = Math.min(discountAmount, subtotalExGst);

    cart.coupon = {
      couponId: coupon._id,
      code: coupon.code,
      title: coupon.title,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
      isApplied: true,
      appliedAt: new Date(),
    };

    await cart.save();

    return res.status(200).json({
      success: true,
      message: `${coupon.code} coupon applied successfully`,
      coupon: cart.coupon,
    });
  } catch (error) {
    console.error("APPLY COUPON ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Coupon apply failed",
    });
  }
};