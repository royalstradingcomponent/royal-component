const Product = require("../models/Product");
const Warehouse = require("../models/Warehouse");
const WarehouseBox = require("../models/WarehouseBox");
const WarehouseStick = require("../models/WarehouseStick");
const StockLocation = require("../models/StockLocation");

const {
  updateWarehouseStatistics,
  updateBoxStatistics,
  updateStickStatistics,
} = require("../services/warehouseInventoryService");

/*
|--------------------------------------------------------------------------
| Create Stock Location
|--------------------------------------------------------------------------
*/

exports.createStockLocation = async (req, res) => {
  try {
    const {
      productId,
      warehouseId,
      boxId,
      stickId = null,

      quantity = 0,

      batchNumber = "",
      lotNumber = "",
      serialNumber = "",

      supplierSourceId = null,
      supplierName = "",
      supplierInvoiceNo = "",
      purchaseOrderNo = "",

      purchasePrice = 0,
      sellingPrice = 0,
      mrp = 0,
      gstPercent = 18,

      manufacturingDate = null,
      expiryDate = null,

      remarks = "",
      locationType = "STICK",
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | Validation
    |--------------------------------------------------------------------------
    */

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product is required.",
      });
    }

    if (!warehouseId) {
      return res.status(400).json({
        success: false,
        message: "Warehouse is required.",
      });
    }

    if (!boxId) {
      return res.status(400).json({
        success: false,
        message: "Box is required.",
      });
    }

    if (locationType === "STICK" && !stickId) {
      return res.status(400).json({
        success: false,
        message: "Stick is required.",
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than zero.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Check Product
    |--------------------------------------------------------------------------
    */

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Check Warehouse
    |--------------------------------------------------------------------------
    */

    const warehouse = await Warehouse.findById(
      warehouseId
    );

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: "Warehouse not found.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Check Box
    |--------------------------------------------------------------------------
    */

    const box = await WarehouseBox.findById(boxId);

    if (!box) {
      return res.status(404).json({
        success: false,
        message: "Warehouse Box not found.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Check Stick
    |--------------------------------------------------------------------------
    */

    let stick = null;

    if (stickId) {
      stick =
        await WarehouseStick.findById(stickId);

      if (!stick) {
        return res.status(404).json({
          success: false,
          message: "Warehouse Stick not found.",
        });
      }

      if (
        stick.occupiedQuantity + quantity >
        stick.maxCapacity
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Stick capacity exceeded.",
        });
      }
    }


        /*
    |--------------------------------------------------------------------------
    | Check Existing Location
    |--------------------------------------------------------------------------
    */

    const existingLocation =
      await StockLocation.findOne({
        productId,
        warehouseId,
        boxId,
        stickId,
        batchNumber,
        lotNumber,
      });

    /*
    |--------------------------------------------------------------------------
    | Update Existing Stock
    |--------------------------------------------------------------------------
    */

    if (existingLocation) {

      existingLocation.quantity += quantity;

      existingLocation.purchasePrice =
        purchasePrice;

      existingLocation.sellingPrice =
        sellingPrice;

      existingLocation.mrp = mrp;

      existingLocation.gstPercent =
        gstPercent;

      existingLocation.supplierSourceId =
        supplierSourceId;

      existingLocation.supplierName =
        supplierName;

      existingLocation.supplierInvoiceNo =
        supplierInvoiceNo;

      existingLocation.purchaseOrderNo =
        purchaseOrderNo;

      existingLocation.manufacturingDate =
        manufacturingDate;

      existingLocation.expiryDate =
        expiryDate;

      existingLocation.remarks =
        remarks;

      existingLocation.updatedBy =
        req.user._id;

      await existingLocation.save();

      /*
      |--------------------------------------------------------------------------
      | Update Stick
      |--------------------------------------------------------------------------
      */

      if (stick) {

        stick.occupiedQuantity += quantity;

        await stick.save();

        await updateStickStatistics(
          stick._id
        );

      }

      /*
      |--------------------------------------------------------------------------
      | Update Statistics
      |--------------------------------------------------------------------------
      */

      await updateBoxStatistics(
        box._id
      );

      await updateWarehouseStatistics(
        warehouse._id
      );

      return res.status(200).json({
        success: true,
        message:
          "Stock quantity updated successfully.",
        data: existingLocation,
      });

    }

    /*
    |--------------------------------------------------------------------------
    | Create New Stock Location
    |--------------------------------------------------------------------------
    */

    const location =
      await StockLocation.create({

        productId,

        warehouseId,

        boxId,

        stickId,

        quantity,

        batchNumber,

        lotNumber,

        serialNumber,

        supplierSourceId,

        supplierName,

        supplierInvoiceNo,

        purchaseOrderNo,

        purchasePrice,

        sellingPrice,

        mrp,

        gstPercent,

        manufacturingDate,

        expiryDate,

        remarks,

        locationType,

        createdBy:
          req.user._id,

        updatedBy:
          req.user._id,

      });

    /*
    |--------------------------------------------------------------------------
    | Update Product Stock
    |--------------------------------------------------------------------------
    */

    product.stock =
      (product.stock || 0) +
      quantity;

    await product.save();

    /*
    |--------------------------------------------------------------------------
    | Update Stick Quantity
    |--------------------------------------------------------------------------
    */

    if (stick) {

      stick.occupiedQuantity += quantity;

      await stick.save();

      await updateStickStatistics(
        stick._id
      );

    }

    /*
    |--------------------------------------------------------------------------
    | Update Box Statistics
    |--------------------------------------------------------------------------
    */

    await updateBoxStatistics(
      box._id
    );

    /*
    |--------------------------------------------------------------------------
    | Update Warehouse Statistics
    |--------------------------------------------------------------------------
    */

    await updateWarehouseStatistics(
      warehouse._id
    );

    return res.status(201).json({

      success: true,

      message:
        "Stock Location created successfully.",

      data: location,

    });

  } catch (error) {

    console.error(
      "Create Stock Location Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to create stock location.",

      error: error.message,

    });

  }

};

/*
|--------------------------------------------------------------------------
| Get All Stock Locations
|--------------------------------------------------------------------------
*/

exports.getStockLocations = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      warehouseId,
      boxId,
      stickId,
      productId,
      status,
      locationType,
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = {};

    if (warehouseId) query.warehouseId = warehouseId;
    if (boxId) query.boxId = boxId;
    if (stickId) query.stickId = stickId;
    if (productId) query.productId = productId;
    if (status) query.status = status;
    if (locationType) query.locationType = locationType;

    if (search) {
      query.$or = [
        {
          batchNumber: {
            $regex: search,
            $options: "i",
          },
        },
        {
          lotNumber: {
            $regex: search,
            $options: "i",
          },
        },
        {
          supplierName: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const skip =
      (Number(page) - 1) *
      Number(limit);

    const total =
      await StockLocation.countDocuments(
        query
      );

    const locations =
      await StockLocation.find(query)
        .populate(
          "productId",
          "name sku mpn brand stock"
        )
        .populate(
          "warehouseId",
          "warehouseCode warehouseName"
        )
        .populate(
          "boxId",
          "boxCode boxName rack shelf"
        )
        .populate(
          "stickId",
          "stickCode stickName"
        )
        .populate(
          "createdBy",
          "name email"
        )
        .populate(
          "updatedBy",
          "name email"
        )
        .sort({
          [sortBy]:
            sortOrder === "asc"
              ? 1
              : -1,
        })
        .skip(skip)
        .limit(Number(limit));

    return res.status(200).json({
      success: true,

      data: locations,

      pagination: {
        total,

        currentPage:
          Number(page),

        totalPages: Math.ceil(
          total /
            Number(limit)
        ),

        limit:
          Number(limit),

        hasNext:
          Number(page) <
          Math.ceil(
            total /
              Number(limit)
          ),

        hasPrevious:
          Number(page) > 1,
      },
    });

  } catch (error) {

    console.error(
      "Get Stock Locations Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch stock locations.",
      error: error.message,
    });

  }
};

/*
|--------------------------------------------------------------------------
| Get Stock Location By Id
|--------------------------------------------------------------------------
*/

exports.getStockLocationById =
async (req, res) => {

  try {

    const location =
      await StockLocation.findById(
        req.params.id
      )
        .populate("productId")
        .populate("warehouseId")
        .populate("boxId")
        .populate("stickId")
        .populate(
          "createdBy",
          "name email"
        )
        .populate(
          "updatedBy",
          "name email"
        );

    if (!location) {
      return res.status(404).json({
        success: false,
        message:
          "Stock Location not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: location,
    });

  } catch (error) {

    console.error(
      "Get Stock Location Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch stock location.",
      error: error.message,
    });

  }

};

/*
|--------------------------------------------------------------------------
| Search Product Location
|--------------------------------------------------------------------------
*/

exports.searchProductLocation =
async (req, res) => {

  try {

    const keyword =
      req.query.keyword || "";

    if (!keyword) {
      return res.status(400).json({
        success: false,
        message:
          "Search keyword is required.",
      });
    }

    const locations =
      await StockLocation.find()
        .populate({
          path: "productId",
          match: {
            $or: [
              {
                name: {
                  $regex: keyword,
                  $options: "i",
                },
              },
              {
                sku: {
                  $regex: keyword,
                  $options: "i",
                },
              },
              {
                mpn: {
                  $regex: keyword,
                  $options: "i",
                },
              },
            ],
          },
        })
       .populate(
  "warehouseId",
  "warehouseCode name"
)
        .populate(
          "boxId",
          "boxCode boxName rack shelf"
        )
        .populate(
          "stickId",
          "stickCode stickName"
        );

    const filtered =
      locations.filter(
        (item) => item.productId
      );

    return res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered,
    });

  } catch (error) {

    console.error(
      "Search Product Location Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to search product location.",
      error: error.message,
    });

  }

};

/*
|--------------------------------------------------------------------------
| Update Stock Location
|--------------------------------------------------------------------------
*/

exports.updateStockLocation = async (req, res) => {
  try {

    const location =
      await StockLocation.findById(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Stock Location not found.",
      });
    }

    const fields = [
      "batchNumber",
      "lotNumber",
      "serialNumber",
      "supplierSourceId",
      "supplierName",
      "supplierInvoiceNo",
      "purchaseOrderNo",
      "purchasePrice",
      "sellingPrice",
      "mrp",
      "gstPercent",
      "manufacturingDate",
      "expiryDate",
      "remarks",
      "locationType",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        location[field] = req.body[field];
      }
    });

    location.updatedBy = req.user._id;

    await location.save();

    await updateStickStatistics(location.stickId);

    await updateBoxStatistics(location.boxId);

    await updateWarehouseStatistics(
      location.warehouseId
    );

    return res.status(200).json({
      success: true,
      message: "Stock Location updated successfully.",
      data: location,
    });

  } catch (error) {

    console.error(
      "Update Stock Location Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update stock location.",
      error: error.message,
    });

  }
};

/*
|--------------------------------------------------------------------------
| Increase Stock
|--------------------------------------------------------------------------
*/

exports.increaseStock = async (req, res) => {

  try {

    const { quantity } = req.body;

    const location =
      await StockLocation.findById(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Stock Location not found.",
      });
    }

    location.quantity += Number(quantity);

    location.updatedBy = req.user._id;

    await location.save();

    /*
    |--------------------------------------------------------------------------
    | Product Stock
    |--------------------------------------------------------------------------
    */

    await Product.findByIdAndUpdate(
      location.productId,
      {
        $inc: {
          stock: Number(quantity),
        },
      }
    );

    /*
    |--------------------------------------------------------------------------
    | Stick
    |--------------------------------------------------------------------------
    */

    if (location.stickId) {

      await WarehouseStick.findByIdAndUpdate(
        location.stickId,
        {
          $inc: {
            occupiedQuantity:
              Number(quantity),
          },
        }
      );

      await updateStickStatistics(
        location.stickId
      );

    }

    await updateBoxStatistics(
      location.boxId
    );

    await updateWarehouseStatistics(
      location.warehouseId
    );

    return res.status(200).json({
      success: true,
      message: "Stock increased successfully.",
      data: location,
    });

  } catch (error) {

    console.error(
      "Increase Stock Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to increase stock.",
      error: error.message,
    });

  }

};

/*
|--------------------------------------------------------------------------
| Decrease Stock
|--------------------------------------------------------------------------
*/

exports.decreaseStock = async (req, res) => {

  try {

    const { quantity } = req.body;

    const location =
      await StockLocation.findById(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Stock Location not found.",
      });
    }

    if (
      quantity >
      location.availableQuantity
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Insufficient stock available.",
      });
    }

    location.quantity -= Number(quantity);

    location.updatedBy = req.user._id;

    await location.save();

    /*
    |--------------------------------------------------------------------------
    | Product Stock
    |--------------------------------------------------------------------------
    */

    await Product.findByIdAndUpdate(
      location.productId,
      {
        $inc: {
          stock: -Number(quantity),
        },
      }
    );

    /*
    |--------------------------------------------------------------------------
    | Stick
    |--------------------------------------------------------------------------
    */

    if (location.stickId) {

      await WarehouseStick.findByIdAndUpdate(
        location.stickId,
        {
          $inc: {
            occupiedQuantity:
              -Number(quantity),
          },
        }
      );

      await updateStickStatistics(
        location.stickId
      );

    }

    await updateBoxStatistics(
      location.boxId
    );

    await updateWarehouseStatistics(
      location.warehouseId
    );

    return res.status(200).json({
      success: true,
      message: "Stock decreased successfully.",
      data: location,
    });

  } catch (error) {

    console.error(
      "Decrease Stock Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to decrease stock.",
      error: error.message,
    });

  }

};

/*
|--------------------------------------------------------------------------
| Reserve Stock
|--------------------------------------------------------------------------
*/

exports.reserveStock = async (req, res) => {
  try {

    const { quantity } = req.body;

    const location =
      await StockLocation.findById(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Stock Location not found.",
      });
    }

    if (quantity > location.availableQuantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient available stock.",
      });
    }

    location.reservedQuantity += Number(quantity);
    location.updatedBy = req.user._id;

    await location.save();

    await updateStickStatistics(location.stickId);
    await updateBoxStatistics(location.boxId);
    await updateWarehouseStatistics(location.warehouseId);

    return res.status(200).json({
      success: true,
      message: "Stock reserved successfully.",
      data: location,
    });

  } catch (error) {

    console.error("Reserve Stock Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reserve stock.",
      error: error.message,
    });

  }
};

/*
|--------------------------------------------------------------------------
| Release Reserved Stock
|--------------------------------------------------------------------------
*/

exports.releaseReservedStock = async (req, res) => {

  try {

    const { quantity } = req.body;

    const location =
      await StockLocation.findById(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Stock Location not found.",
      });
    }

    location.reservedQuantity -= Number(quantity);

    if (location.reservedQuantity < 0) {
      location.reservedQuantity = 0;
    }

    location.updatedBy = req.user._id;

    await location.save();

    await updateStickStatistics(location.stickId);
    await updateBoxStatistics(location.boxId);
    await updateWarehouseStatistics(location.warehouseId);

    return res.status(200).json({
      success: true,
      message: "Reserved stock released successfully.",
      data: location,
    });

  } catch (error) {

    console.error("Release Reserved Stock Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to release reserved stock.",
      error: error.message,
    });

  }

};

/*
|--------------------------------------------------------------------------
| Mark Damaged Stock
|--------------------------------------------------------------------------
*/

exports.markDamagedStock = async (req, res) => {

  try {

    const { quantity } = req.body;

    const location =
      await StockLocation.findById(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Stock Location not found.",
      });
    }

    location.damagedQuantity += Number(quantity);

    if (location.damagedQuantity > location.quantity) {
      location.damagedQuantity = location.quantity;
    }

    location.updatedBy = req.user._id;

    await location.save();

    await updateStickStatistics(location.stickId);
    await updateBoxStatistics(location.boxId);
    await updateWarehouseStatistics(location.warehouseId);

    return res.status(200).json({
      success: true,
      message: "Damaged stock updated successfully.",
      data: location,
    });

  } catch (error) {

    console.error("Damaged Stock Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update damaged stock.",
      error: error.message,
    });

  }

};

/*
|--------------------------------------------------------------------------
| Restore Damaged Stock
|--------------------------------------------------------------------------
*/

exports.restoreDamagedStock = async (req, res) => {

  try {

    const { quantity } = req.body;

    const location =
      await StockLocation.findById(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Stock Location not found.",
      });
    }

    location.damagedQuantity -= Number(quantity);

    if (location.damagedQuantity < 0) {
      location.damagedQuantity = 0;
    }

    location.updatedBy = req.user._id;

    await location.save();

    await updateStickStatistics(location.stickId);
    await updateBoxStatistics(location.boxId);
    await updateWarehouseStatistics(location.warehouseId);

    return res.status(200).json({
      success: true,
      message: "Damaged stock restored successfully.",
      data: location,
    });

  } catch (error) {

    console.error("Restore Damaged Stock Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to restore damaged stock.",
      error: error.message,
    });

  }

};

/*
|--------------------------------------------------------------------------
| Delete Stock Location
|--------------------------------------------------------------------------
*/

exports.deleteStockLocation = async (req, res) => {

  try {

    const location =
      await StockLocation.findById(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Stock Location not found.",
      });
    }

    await Product.findByIdAndUpdate(
      location.productId,
      {
        $inc: {
          stock: -location.quantity,
        },
      }
    );

    if (location.stickId) {

      await WarehouseStick.findByIdAndUpdate(
        location.stickId,
        {
          $inc: {
            occupiedQuantity: -location.quantity,
          },
        }
      );

      await updateStickStatistics(location.stickId);

    }

    await location.deleteOne();

    await updateBoxStatistics(location.boxId);
    await updateWarehouseStatistics(location.warehouseId);

    return res.status(200).json({
      success: true,
      message: "Stock Location deleted successfully.",
    });

  } catch (error) {

    console.error("Delete Stock Location Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete stock location.",
      error: error.message,
    });

  }

};

/*
|--------------------------------------------------------------------------
| Dashboard Statistics
|--------------------------------------------------------------------------
*/

exports.getStockDashboardStats = async (req, res) => {

  try {

    const [
      totalLocations,
      inStock,
      lowStock,
      outOfStock,
      reserved,
      damaged,
    ] = await Promise.all([

      StockLocation.countDocuments(),

      StockLocation.countDocuments({
        status: "IN_STOCK",
      }),

      StockLocation.countDocuments({
        status: "LOW_STOCK",
      }),

      StockLocation.countDocuments({
        status: "OUT_OF_STOCK",
      }),

      StockLocation.countDocuments({
        status: "RESERVED",
      }),

      StockLocation.countDocuments({
        status: "DAMAGED",
      }),

    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalLocations,
        inStock,
        lowStock,
        outOfStock,
        reserved,
        damaged,
      },
    });

  } catch (error) {

    console.error("Stock Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load stock dashboard.",
      error: error.message,
    });

  }

};