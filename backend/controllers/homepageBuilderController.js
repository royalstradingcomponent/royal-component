const HomepageBuilder = require(
  "../models/HomepageBuilder"
);

exports.getSections = async (
  req,
  res
) => {
  try {
    const sections =
      await HomepageBuilder.find()
        .sort({
          sortOrder: 1,
        });

    res.status(200).json({
      success: true,
      sections,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getSingleSection =
  async (req, res) => {
    try {
      const section =
        await HomepageBuilder.findById(
          req.params.id
        );

      if (!section) {
        return res.status(404).json({
          success: false,
          message:
            "Section not found",
        });
      }

      res.status(200).json({
        success: true,
        section,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

exports.createSection =
  async (req, res) => {
    try {
      const section =
        await HomepageBuilder.create(
          req.body
        );

      res.status(201).json({
        success: true,
        section,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

exports.updateSection =
  async (req, res) => {
    try {
      const section =
        await HomepageBuilder.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        );

      if (!section) {
        return res.status(404).json({
          success: false,
          message:
            "Section not found",
        });
      }

      res.status(200).json({
        success: true,
        section,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

exports.deleteSection =
  async (req, res) => {
    try {
      const section =
        await HomepageBuilder.findByIdAndDelete(
          req.params.id
        );

      if (!section) {
        return res.status(404).json({
          success: false,
          message:
            "Section not found",
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Section deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

exports.getActiveSections =
  async (req, res) => {
    try {
      const sections =
        await HomepageBuilder.find({
          active: true,
        }).sort({
          sortOrder: 1,
        });

      res.status(200).json({
        success: true,
        sections,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };