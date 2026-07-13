const Warehouse = require("../models/Warehouse");
const WarehouseBox = require("../models/WarehouseBox");
const WarehouseStick = require("../models/WarehouseStick");

const {
  updateWarehouseStatistics,
  updateBoxStatistics,
} = require("../services/warehouseInventoryService");

/*
|--------------------------------------------------------------------------
| Create Warehouse Stick
|--------------------------------------------------------------------------
*/

exports.createWarehouseStick = async (req, res) => {
  try {
    const {
      warehouseId,
      boxId,
      stickCode,
      stickName,
      displayName = "",
      stickType = "IC_TUBE",
      material = "PLASTIC",
      orientation = "HORIZONTAL",
      maxCapacity = 25,
      color = "#2563eb",
      icon = "package",
      remarks = "",
      temperature = null,
      humidity = null,
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | Validation
    |--------------------------------------------------------------------------
    */

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

    if (!stickCode) {
      return res.status(400).json({
        success: false,
        message: "Stick Code is required.",
      });
    }

    if (!stickName) {
      return res.status(400).json({
        success: false,
        message: "Stick Name is required.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Warehouse Check
    |--------------------------------------------------------------------------
    */

    const warehouse =
      await Warehouse.findById(
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
    | Box Check
    |--------------------------------------------------------------------------
    */

    const box =
      await WarehouseBox.findById(
        boxId
      );

    if (!box) {
      return res.status(404).json({
        success: false,
        message: "Warehouse Box not found.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Duplicate Check
    |--------------------------------------------------------------------------
    */

    const alreadyExists =
      await WarehouseStick.findOne({
        stickCode:
          stickCode.toUpperCase(),
      });

    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message:
          "Stick Code already exists.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Capacity Validation
    |--------------------------------------------------------------------------
    */

    if (
      box.occupiedSticks >=
      box.maxStickCapacity
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Box capacity is full.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Create Stick
    |--------------------------------------------------------------------------
    */

    const stick =
      await WarehouseStick.create({
        warehouseId,

        boxId,

        stickCode:
          stickCode.toUpperCase(),

        stickName,

        displayName,

        stickType,

        material,

        orientation,

        maxCapacity,

        color,

        icon,

        remarks,

        temperature,

        humidity,

        status: "ACTIVE",

        createdBy: req.user._id,

        updatedBy: req.user._id,
      });

    /*
    |--------------------------------------------------------------------------
    | Update Box
    |--------------------------------------------------------------------------
    */

    box.occupiedSticks += 1;

    box.statistics.totalSticks += 1;

    await box.save();

    /*
    |--------------------------------------------------------------------------
    | Update Statistics
    |--------------------------------------------------------------------------
    */

    await updateBoxStatistics(box._id);

    await updateWarehouseStatistics(
      warehouseId
    );

    return res.status(201).json({
      success: true,
      message:
        "Warehouse Stick created successfully.",
      data: stick,
    });

  } catch (error) {

    console.error(
      "Create Warehouse Stick Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create warehouse stick.",
      error: error.message,
    });

  }
};

/*
|--------------------------------------------------------------------------
| Get All Warehouse Sticks
|--------------------------------------------------------------------------
*/

exports.getWarehouseSticks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      warehouseId,
      boxId,
      status,
      stickType,
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = {};

    if (warehouseId) {
      query.warehouseId = warehouseId;
    }

    if (boxId) {
      query.boxId = boxId;
    }

    if (status) {
      query.status = status;
    }

    if (stickType) {
      query.stickType = stickType;
    }

    if (search) {
      query.$or = [
        {
          stickCode: {
            $regex: search,
            $options: "i",
          },
        },
        {
          stickName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          displayName: {
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
      await WarehouseStick.countDocuments(
        query
      );

    const sticks =
      await WarehouseStick.find(query)
       .populate(
  "warehouseId",
  "warehouseCode name"
)
        .populate(
          "boxId",
          "boxCode boxName rack shelf"
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
      data: sticks,

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
      "Get Warehouse Sticks Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch warehouse sticks.",
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Warehouse Stick By Id
|--------------------------------------------------------------------------
*/

exports.getWarehouseStickById =
  async (req, res) => {
    try {
      const stick =
        await WarehouseStick.findById(
          req.params.id
        )
          .populate(
            "warehouseId"
          )
          .populate(
            "boxId"
          )
          .populate(
            "createdBy",
            "name email"
          )
          .populate(
            "updatedBy",
            "name email"
          );

      if (!stick) {
        return res.status(404).json({
          success: false,
          message:
            "Warehouse Stick not found.",
        });
      }

      return res.status(200).json({
        success: true,
        data: stick,
      });
    } catch (error) {
      console.error(
        "Get Warehouse Stick Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch warehouse stick.",
        error: error.message,
      });
    }
  };

/*
|--------------------------------------------------------------------------
| Update Warehouse Stick
|--------------------------------------------------------------------------
*/

exports.updateWarehouseStick = async (req, res) => {
  try {
    const stick = await WarehouseStick.findById(req.params.id);

    if (!stick) {
      return res.status(404).json({
        success: false,
        message: "Warehouse Stick not found.",
      });
    }

    const fields = [
      "stickName",
      "displayName",
      "displayOrder",
      "stickType",
      "material",
      "orientation",
      "maxCapacity",
      "color",
      "icon",
      "remarks",
      "temperature",
      "humidity",
      "length",
      "width",
      "height",
      "weight",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        stick[field] = req.body[field];
      }
    });

    stick.updatedBy = req.user._id;

    await stick.save();

    await updateBoxStatistics(stick.boxId);

    await updateWarehouseStatistics(
      stick.warehouseId
    );

    return res.status(200).json({
      success: true,
      message:
        "Warehouse Stick updated successfully.",
      data: stick,
    });

  } catch (error) {

    console.error(
      "Update Warehouse Stick Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update warehouse stick.",
      error: error.message,
    });

  }
};

/*
|--------------------------------------------------------------------------
| Delete Warehouse Stick
|--------------------------------------------------------------------------
*/

exports.deleteWarehouseStick = async (req, res) => {
  try {

    const stick =
      await WarehouseStick.findById(
        req.params.id
      );

    if (!stick) {
      return res.status(404).json({
        success: false,
        message:
          "Warehouse Stick not found.",
      });
    }

    const box =
      await WarehouseBox.findById(
        stick.boxId
      );

    if (box) {

      if (box.occupiedSticks > 0) {
        box.occupiedSticks -= 1;
      }

      if (
        box.statistics.totalSticks > 0
      ) {
        box.statistics.totalSticks -= 1;
      }

      await box.save();
    }

    await stick.deleteOne();

    await updateBoxStatistics(
      stick.boxId
    );

    await updateWarehouseStatistics(
      stick.warehouseId
    );

    return res.status(200).json({
      success: true,
      message:
        "Warehouse Stick deleted successfully.",
    });

  } catch (error) {

    console.error(
      "Delete Warehouse Stick Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete warehouse stick.",
      error: error.message,
    });

  }
};

/*
|--------------------------------------------------------------------------
| Change Warehouse Stick Status
|--------------------------------------------------------------------------
*/

exports.changeWarehouseStickStatus =
  async (req, res) => {

    try {

      const { status } = req.body;

      const allowedStatus = [
        "ACTIVE",
        "EMPTY",
        "FULL",
        "DAMAGED",
        "RESERVED",
        "INACTIVE",
      ];

      if (
        !allowedStatus.includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid status.",
        });
      }

      const stick =
        await WarehouseStick.findById(
          req.params.id
        );

      if (!stick) {
        return res.status(404).json({
          success: false,
          message:
            "Warehouse Stick not found.",
        });
      }

      stick.status = status;

      stick.updatedBy = req.user._id;

      await stick.save();

      return res.status(200).json({
        success: true,
        message:
          "Warehouse Stick status updated successfully.",
        data: stick,
      });

    } catch (error) {

      console.error(
        "Change Warehouse Stick Status Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to change warehouse stick status.",
        error: error.message,
      });

    }

  };

/*
|--------------------------------------------------------------------------
| Dashboard Statistics
|--------------------------------------------------------------------------
*/

exports.getWarehouseStickDashboardStats =
  async (req, res) => {

    try {

      const [
        totalSticks,
        activeSticks,
        emptySticks,
        fullSticks,
        reservedSticks,
        damagedSticks,
      ] = await Promise.all([

        WarehouseStick.countDocuments(),

        WarehouseStick.countDocuments({
          status: "ACTIVE",
        }),

        WarehouseStick.countDocuments({
          status: "EMPTY",
        }),

        WarehouseStick.countDocuments({
          status: "FULL",
        }),

        WarehouseStick.countDocuments({
          status: "RESERVED",
        }),

        WarehouseStick.countDocuments({
          status: "DAMAGED",
        }),

      ]);

      return res.status(200).json({
        success: true,

        data: {
          totalSticks,
          activeSticks,
          emptySticks,
          fullSticks,
          reservedSticks,
          damagedSticks,
        },

      });

    } catch (error) {

      console.error(
        "Warehouse Stick Dashboard Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load warehouse stick dashboard.",
        error: error.message,
      });

    }

  };