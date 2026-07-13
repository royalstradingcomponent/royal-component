const Warehouse = require("../models/Warehouse");
const WarehouseBox = require("../models/WarehouseBox");
const WarehouseStick = require("../models/WarehouseStick");
const StockLocation = require("../models/StockLocation");

/*
|--------------------------------------------------------------------------
| Update Warehouse Statistics
|--------------------------------------------------------------------------
*/

const updateWarehouseStatistics = async (warehouseId) => {
  const [
    totalBoxes,
    totalSticks,
    stockLocations,
  ] = await Promise.all([
    WarehouseBox.countDocuments({
      warehouseId,
    }),

    WarehouseStick.countDocuments({
      warehouseId,
    }),

    StockLocation.find({
      warehouseId,
    }),
  ]);

  let totalComponents = 0;
  let totalQuantity = 0;
  let lowStockItems = 0;

  const uniqueProducts = new Set();

  stockLocations.forEach((item) => {
    uniqueProducts.add(item.productId.toString());

    totalQuantity += item.quantity;

    if (item.status === "LOW_STOCK") {
      lowStockItems++;
    }
  });

  totalComponents = uniqueProducts.size;

  await Warehouse.findByIdAndUpdate(
    warehouseId,
    {
      $set: {
        "statistics.totalBoxes": totalBoxes,
        "statistics.totalSticks": totalSticks,
        "statistics.totalComponents":
          totalComponents,
        "statistics.totalQuantity":
          totalQuantity,
        "statistics.lowStockItems":
          lowStockItems,
      },
    }
  );
};

/*
|--------------------------------------------------------------------------
| Update Box Statistics
|--------------------------------------------------------------------------
*/

const updateBoxStatistics = async (boxId) => {
  const sticks =
    await WarehouseStick.find({
      boxId,
    });

  const stock =
    await StockLocation.find({
      boxId,
    });

  const totalSticks = sticks.length;

  const totalQuantity = stock.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const uniqueProducts = new Set();

  stock.forEach((item) =>
    uniqueProducts.add(
      item.productId.toString()
    )
  );

  const lowStockItems =
    stock.filter(
      (item) =>
        item.status === "LOW_STOCK"
    ).length;

  await WarehouseBox.findByIdAndUpdate(
    boxId,
    {
      $set: {
        "statistics.totalSticks":
          totalSticks,

        "statistics.totalComponents":
          uniqueProducts.size,

        "statistics.totalQuantity":
          totalQuantity,

        "statistics.lowStockItems":
          lowStockItems,
      },
    }
  );
};

/*
|--------------------------------------------------------------------------
| Update Stick Statistics
|--------------------------------------------------------------------------
*/

const updateStickStatistics =
  async (stickId) => {
    const stock =
      await StockLocation.find({
        stickId,
      });

    const totalQuantity =
      stock.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

    const uniqueProducts =
      new Set();

    stock.forEach((item) =>
      uniqueProducts.add(
        item.productId.toString()
      )
    );

    await WarehouseStick.findByIdAndUpdate(
      stickId,
      {
        $set: {
          occupiedQuantity:
            totalQuantity,

          "statistics.totalProducts":
            uniqueProducts.size,

          "statistics.totalQuantity":
            totalQuantity,
        },
      }
    );
  };

  /*
|--------------------------------------------------------------------------
| Add Stock
|--------------------------------------------------------------------------
*/

const addStockToLocation = async ({
  productId,
  warehouseId,
  boxId,
  stickId = null,
  quantity,
  purchasePrice = 0,
  sellingPrice = 0,
  batchNumber = "",
  lotNumber = "",
  supplierSourceId = null,
  remarks = "",
  adminId = null,
}) => {
  let stock = await StockLocation.findOne({
    productId,
    warehouseId,
    boxId,
    stickId,
    batchNumber,
    lotNumber,
  });

  if (stock) {
    stock.quantity += Number(quantity);
    stock.purchasePrice = purchasePrice;
    stock.sellingPrice = sellingPrice;
    stock.remarks = remarks;
    stock.updatedBy = adminId;

    await stock.save();
  } else {
    stock = await StockLocation.create({
      productId,
      warehouseId,
      boxId,
      stickId,
      quantity,
      purchasePrice,
      sellingPrice,
      batchNumber,
      lotNumber,
      supplierSourceId,
      remarks,
      createdBy: adminId,
      updatedBy: adminId,
    });
  }

  await updateWarehouseStatistics(warehouseId);
  await updateBoxStatistics(boxId);

  if (stickId) {
    await updateStickStatistics(stickId);
  }

  return stock;
};

/*
|--------------------------------------------------------------------------
| Remove Stock
|--------------------------------------------------------------------------
*/

const removeStockFromLocation = async ({
  stockLocationId,
  quantity,
}) => {

  const stock = await StockLocation.findById(
    stockLocationId
  );

  if (!stock) {
    throw new Error("Stock location not found.");
  }

  if (stock.availableQuantity < quantity) {
    throw new Error(
      "Insufficient available stock."
    );
  }

  stock.quantity -= Number(quantity);

  await stock.save();

  await updateWarehouseStatistics(
    stock.warehouseId
  );

  await updateBoxStatistics(stock.boxId);

  if (stock.stickId) {
    await updateStickStatistics(
      stock.stickId
    );
  }

  return stock;
};

/*
|--------------------------------------------------------------------------
| Reserve Stock
|--------------------------------------------------------------------------
*/

const reserveStock = async ({
  stockLocationId,
  quantity,
}) => {

  const stock =
    await StockLocation.findById(
      stockLocationId
    );

  if (!stock) {
    throw new Error("Stock not found.");
  }

  if (stock.availableQuantity < quantity) {
    throw new Error(
      "Not enough available quantity."
    );
  }

  stock.reservedQuantity += Number(quantity);

  await stock.save();

  return stock;
};

/*
|--------------------------------------------------------------------------
| Release Reserved Stock
|--------------------------------------------------------------------------
*/

const releaseReservedStock = async ({
  stockLocationId,
  quantity,
}) => {

  const stock =
    await StockLocation.findById(
      stockLocationId
    );

  if (!stock) {
    throw new Error("Stock not found.");
  }

  stock.reservedQuantity -= Number(quantity);

  if (stock.reservedQuantity < 0) {
    stock.reservedQuantity = 0;
  }

  await stock.save();

  return stock;
};

/*
|--------------------------------------------------------------------------
| Transfer Stock
|--------------------------------------------------------------------------
*/

const transferStock = async ({
  fromStockLocationId,
  toWarehouseId,
  toBoxId,
  toStickId = null,
  quantity,
  adminId = null,
}) => {

  const source =
    await StockLocation.findById(
      fromStockLocationId
    );

  if (!source) {
    throw new Error("Source stock not found.");
  }

  if (source.availableQuantity < quantity) {
    throw new Error(
      "Transfer quantity exceeds available stock."
    );
  }

  await removeStockFromLocation({
    stockLocationId:
      fromStockLocationId,
    quantity,
  });

  const destination =
    await addStockToLocation({
      productId: source.productId,
      warehouseId: toWarehouseId,
      boxId: toBoxId,
      stickId: toStickId,
      quantity,
      purchasePrice:
        source.purchasePrice,
      sellingPrice:
        source.sellingPrice,
      batchNumber:
        source.batchNumber,
      lotNumber:
        source.lotNumber,
      supplierSourceId:
        source.supplierSourceId,
      remarks:
        "Transferred from another location",
      adminId,
    });

  return {
    source,
    destination,
  };
};

/*
|--------------------------------------------------------------------------
| EXPORTS
|--------------------------------------------------------------------------
*/

module.exports = {
  updateWarehouseStatistics,
  updateBoxStatistics,
  updateStickStatistics,
  addStockToLocation,
  removeStockFromLocation,
  reserveStock,
  releaseReservedStock,
  transferStock,
};