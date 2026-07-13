const Warehouse = require("../models/Warehouse");
const WarehouseBox = require("../models/WarehouseBox");

/*
|--------------------------------------------------------------------------
| Create Warehouse Box
|--------------------------------------------------------------------------
*/

exports.createWarehouseBox = async (req, res) => {
  try {
    const {
      warehouseId,
      boxCode,
      boxName,
      displayName,
      boxNumber,
      rack,
      shelf,
      row,
      column,
      floor,
      zone,
      section,
      maxStickCapacity = 100,
      color = "#2563eb",
      icon = "package",
      remarks = "",
      storageType = "IC",
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

    if (!boxCode) {
      return res.status(400).json({
        success: false,
        message: "Box Code is required.",
      });
    }

    if (!boxName) {
      return res.status(400).json({
        success: false,
        message: "Box Name is required.",
      });
    }

    if (!rack) {
      return res.status(400).json({
        success: false,
        message: "Rack is required.",
      });
    }

    if (!shelf) {
      return res.status(400).json({
        success: false,
        message: "Shelf is required.",
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
    | Duplicate Check
    |--------------------------------------------------------------------------
    */

    const alreadyExists =
      await WarehouseBox.findOne({
        boxCode: boxCode.toUpperCase(),
      });

    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message:
          "Box Code already exists.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Create Box
    |--------------------------------------------------------------------------
    */

    const box =
      await WarehouseBox.create({
        warehouseId,

        boxCode:
          boxCode.toUpperCase(),

        boxName,

        displayName,

        boxNumber,

        rack:
          rack.toUpperCase(),

        shelf:
          shelf.toUpperCase(),

        row:
          row?.toUpperCase() || "",

        column:
          column?.toUpperCase() || "",

        floor:
          floor?.toUpperCase() ||
          "GROUND",

        zone:
          zone?.toUpperCase() || "",

        section:
          section?.toUpperCase() ||
          "",

        maxStickCapacity,

        color,

        icon,

        remarks,

        storageType,

        temperature,

        humidity,

        status: "ACTIVE",

        createdBy: req.user._id,

        updatedBy: req.user._id,
      });

      await warehouse.save();

    return res.status(201).json({
      success: true,
      message:
        "Warehouse Box created successfully.",
      data: box,
    });

  } catch (error) {

    console.error(
      "Create Warehouse Box Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create warehouse box.",
      error: error.message,
    });

  }
};  


/*
|--------------------------------------------------------------------------
| Get All Warehouse Boxes
|--------------------------------------------------------------------------
*/

exports.getWarehouseBoxes = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      warehouseId,
      status,
      rack,
      shelf,
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = {};

    if (warehouseId) {
      query.warehouseId = warehouseId;
    }

    if (status) {
      query.status = status;
    }

    if (rack) {
      query.rack = rack.toUpperCase();
    }

    if (shelf) {
      query.shelf = shelf.toUpperCase();
    }

    if (search) {
      query.$or = [
        {
          boxCode: {
            $regex: search,
            $options: "i",
          },
        },
        {
          boxName: {
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
        {
          rack: {
            $regex: search,
            $options: "i",
          },
        },
        {
          shelf: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const skip =
      (Number(page) - 1) * Number(limit);

    const total =
      await WarehouseBox.countDocuments(query);

    const boxes =
      await WarehouseBox.find(query)
        .populate(
  "warehouseId",
  "warehouseCode name"
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
            sortOrder === "asc" ? 1 : -1,
        })
        .skip(skip)
        .limit(Number(limit));

    return res.status(200).json({
      success: true,

      data: boxes,

      pagination: {
        total,

        currentPage: Number(page),

        totalPages: Math.ceil(
          total / Number(limit)
        ),

        limit: Number(limit),

        hasNext:
          Number(page) <
          Math.ceil(total / Number(limit)),

        hasPrevious:
          Number(page) > 1,
      },
    });
  } catch (error) {
    console.error(
      "Get Warehouse Boxes Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch warehouse boxes.",
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Warehouse Box By Id
|--------------------------------------------------------------------------
*/

exports.getWarehouseBoxById = async (
  req,
  res
) => {
  try {
    const box =
      await WarehouseBox.findById(
        req.params.id
      )
        .populate("warehouseId")
        .populate(
          "createdBy",
          "name email"
        )
        .populate(
          "updatedBy",
          "name email"
        );

    if (!box) {
      return res.status(404).json({
        success: false,
        message:
          "Warehouse Box not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: box,
    });
  } catch (error) {
    console.error(
      "Get Warehouse Box Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch warehouse box.",
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Update Warehouse Box
|--------------------------------------------------------------------------
*/

exports.updateWarehouseBox = async (req, res) => {
  try {
    const box = await WarehouseBox.findById(req.params.id);

    if (!box) {
      return res.status(404).json({
        success: false,
        message: "Warehouse Box not found.",
      });
    }

    const fields = [
      "boxName",
      "displayName",
      "boxNumber",
      "rack",
      "shelf",
      "row",
      "column",
      "floor",
      "zone",
      "section",
      "color",
      "icon",
      "image",
      "thumbnail",
      "gallery",
      "remarks",
      "temperature",
      "humidity",
      "storageType",
      "maxStickCapacity",
      "displayOrder",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        box[field] = req.body[field];
      }
    });

    box.updatedBy = req.user._id;

    await box.save();

    return res.status(200).json({
      success: true,
      message: "Warehouse Box updated successfully.",
      data: box,
    });
  } catch (error) {
    console.error("Update Warehouse Box Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update warehouse box.",
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Delete Warehouse Box
|--------------------------------------------------------------------------
*/

exports.deleteWarehouseBox = async (req, res) => {
  try {
    const box = await WarehouseBox.findById(req.params.id);

    if (!box) {
      return res.status(404).json({
        success: false,
        message: "Warehouse Box not found.",
      });
    }

    await box.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Warehouse Box deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Warehouse Box Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete warehouse box.",
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Change Warehouse Box Status
|--------------------------------------------------------------------------
*/

exports.changeWarehouseBoxStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatus = [
      "ACTIVE",
      "INACTIVE",
      "FULL",
      "EMPTY",
      "MAINTENANCE",
      "RESERVED",
      "DAMAGED",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status.",
      });
    }

    const box = await WarehouseBox.findById(req.params.id);

    if (!box) {
      return res.status(404).json({
        success: false,
        message: "Warehouse Box not found.",
      });
    }

    box.status = status;
    box.updatedBy = req.user._id;

    await box.save();

    return res.status(200).json({
      success: true,
      message: "Warehouse Box status updated successfully.",
      data: box,
    });
  } catch (error) {
    console.error("Change Warehouse Box Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to change warehouse box status.",
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Dashboard Statistics
|--------------------------------------------------------------------------
*/

exports.getWarehouseBoxDashboardStats = async (req, res) => {
  try {
    const [
      totalBoxes,
      activeBoxes,
      fullBoxes,
      emptyBoxes,
      maintenanceBoxes,
    ] = await Promise.all([
      WarehouseBox.countDocuments(),
      WarehouseBox.countDocuments({
        status: "ACTIVE",
      }),
      WarehouseBox.countDocuments({
        status: "FULL",
      }),
      WarehouseBox.countDocuments({
        status: "EMPTY",
      }),
      WarehouseBox.countDocuments({
        status: "MAINTENANCE",
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalBoxes,
        activeBoxes,
        fullBoxes,
        emptyBoxes,
        maintenanceBoxes,
      },
    });
  } catch (error) {
    console.error(
      "Warehouse Box Dashboard Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard statistics.",
      error: error.message,
    });
  }
};