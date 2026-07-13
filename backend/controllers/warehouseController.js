const Warehouse = require("../models/Warehouse");

/*
|--------------------------------------------------------------------------
| Generate Warehouse Code
|--------------------------------------------------------------------------
*/

const generateWarehouseCode = async () => {
  const totalWarehouses = await Warehouse.countDocuments();

  const nextNumber = totalWarehouses + 1;

  return `WH-${String(nextNumber).padStart(3, "0")}`;
};

/*
|--------------------------------------------------------------------------
| Create Warehouse
|--------------------------------------------------------------------------
*/

exports.createWarehouse = async (req, res) => {
  try {
    const {
      name,
      description,
      managerName,
      phone,
      email,
      address = {},
      settings = {},
      isDefault = false,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Warehouse name is required.",
      });
    }

    const warehouseExists = await Warehouse.findOne({
      name: {
        $regex: new RegExp(`^${name.trim()}$`, "i"),
      },
    });

    if (warehouseExists) {
      return res.status(409).json({
        success: false,
        message: "Warehouse already exists.",
      });
    }

    const warehouseCode = await generateWarehouseCode();

    if (isDefault) {
      await Warehouse.updateMany(
        {},
        {
          $set: {
            isDefault: false,
          },
        }
      );
    }

    console.log("========== DATA BEFORE SAVE ==========");
console.log({
  warehouseCode,
  name,
  description,
  managerName,
  phone,
  email,
  address,
  settings,
  isDefault,
  user: req.user,
});
console.log("======================================");

    const warehouse = await Warehouse.create({
      warehouseCode,

      name: name.trim(),

      description,

      managerName,

      phone,

      email,

      address,

      settings,

      isDefault,

      createdBy: req.user?._id || null,

      updatedBy: req.user?._id || null,
    });

    console.log("WAREHOUSE SAVED SUCCESSFULLY");
console.log(warehouse);

    return res.status(201).json({
      success: true,

      message: "Warehouse created successfully.",

      warehouse,
    });
  } catch (error) {
    console.error("CREATE WAREHOUSE ERROR:", error);

    console.log("ERROR NAME =", error.name);
console.log("ERROR MESSAGE =", error.message);

if (error.errors) {
  console.log("VALIDATION ERRORS");
  console.log(error.errors);
}

console.log(error.stack);

    return res.status(500).json({
      success: false,

      message: "Failed to create warehouse.",

      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get All Warehouses
|--------------------------------------------------------------------------
*/

exports.getWarehouses = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status = "",
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          warehouseCode: {
            $regex: search,
            $options: "i",
          },
        },
        {
          managerName: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (status) {
      query.status = status.toUpperCase();
    }

    const total = await Warehouse.countDocuments(query);

    const warehouses = await Warehouse.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    return res.status(200).json({
      success: true,

      warehouses,

      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("GET WAREHOUSE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch warehouses.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Warehouse By Id
|--------------------------------------------------------------------------
*/

exports.getWarehouseById = async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: "Warehouse not found.",
      });
    }

    return res.status(200).json({
      success: true,
      warehouse,
    });
  } catch (error) {
    console.error("GET SINGLE WAREHOUSE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch warehouse.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Update Warehouse
|--------------------------------------------------------------------------
*/

exports.updateWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: "Warehouse not found.",
      });
    }

    const {
      name,
      description,
      managerName,
      phone,
      email,
      address,
      settings,
      isDefault,
    } = req.body;

    if (name && name.trim()) {
      const duplicate = await Warehouse.findOne({
        _id: { $ne: warehouse._id },

        name: {
          $regex: new RegExp(`^${name.trim()}$`, "i"),
        },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Warehouse name already exists.",
        });
      }

      warehouse.name = name.trim();
    }

    if (description !== undefined)
      warehouse.description = description;

    if (managerName !== undefined)
      warehouse.managerName = managerName;

    if (phone !== undefined)
      warehouse.phone = phone;

    if (email !== undefined)
      warehouse.email = email;

    if (address)
      warehouse.address = {
        ...warehouse.address,
        ...address,
      };

    if (settings)
      warehouse.settings = {
        ...warehouse.settings,
        ...settings,
      };

    if (typeof isDefault === "boolean") {
      if (isDefault) {
        await Warehouse.updateMany(
          {},
          {
            $set: {
              isDefault: false,
            },
          }
        );
      }

      warehouse.isDefault = isDefault;
    }

    warehouse.updatedBy = req.user?._id || null;

    await warehouse.save();

    return res.status(200).json({
      success: true,
      message: "Warehouse updated successfully.",
      warehouse,
    });
  } catch (error) {
    console.error("UPDATE WAREHOUSE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update warehouse.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Delete Warehouse
|--------------------------------------------------------------------------
*/

exports.deleteWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: "Warehouse not found.",
      });
    }

    if (warehouse.statistics.totalBoxes > 0) {
      return res.status(400).json({
        success: false,
        message:
          "This warehouse contains boxes. Remove all boxes first.",
      });
    }

    await warehouse.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Warehouse deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE WAREHOUSE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete warehouse.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Change Warehouse Status
|--------------------------------------------------------------------------
*/

exports.changeWarehouseStatus = async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: "Warehouse not found.",
      });
    }

    warehouse.status =
      warehouse.status === "ACTIVE"
        ? "INACTIVE"
        : "ACTIVE";

    warehouse.updatedBy = req.user?._id || null;

    await warehouse.save();

    return res.status(200).json({
      success: true,
      message: `Warehouse ${warehouse.status.toLowerCase()} successfully.`,
      warehouse,
    });
  } catch (error) {
    console.error("STATUS CHANGE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to change warehouse status.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Warehouse Dashboard Statistics
|--------------------------------------------------------------------------
*/

exports.getWarehouseDashboardStats = async (req, res) => {
  try {
    const warehouses = await Warehouse.find();

    const stats = {
      totalWarehouses: warehouses.length,
      activeWarehouses: 0,
      inactiveWarehouses: 0,
      totalBoxes: 0,
      totalSticks: 0,
      totalComponents: 0,
      totalQuantity: 0,
      totalCapacity: 0,
      occupiedCapacity: 0,
      freeCapacity: 0,
      lowStockItems: 0,
    };

    warehouses.forEach((warehouse) => {
      if (warehouse.status === "ACTIVE") {
        stats.activeWarehouses++;
      } else {
        stats.inactiveWarehouses++;
      }

      stats.totalBoxes += warehouse.statistics.totalBoxes || 0;
      stats.totalSticks += warehouse.statistics.totalSticks || 0;
      stats.totalComponents += warehouse.statistics.totalComponents || 0;
      stats.totalQuantity += warehouse.statistics.totalQuantity || 0;
      stats.totalCapacity += warehouse.statistics.totalCapacity || 0;
      stats.occupiedCapacity += warehouse.statistics.occupiedCapacity || 0;
      stats.freeCapacity += warehouse.statistics.freeCapacity || 0;
      stats.lowStockItems += warehouse.statistics.lowStockItems || 0;
    });

    const utilization =
      stats.totalCapacity > 0
        ? Number(
            (
              (stats.occupiedCapacity /
                stats.totalCapacity) *
              100
            ).toFixed(2)
          )
        : 0;

    return res.status(200).json({
      success: true,

      stats: {
        ...stats,
        utilization,
      },
    });
  } catch (error) {
    console.error("WAREHOUSE DASHBOARD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load warehouse dashboard.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};