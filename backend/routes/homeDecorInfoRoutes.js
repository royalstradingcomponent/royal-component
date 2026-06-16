const router = require("express").Router();

const {
  getHomeDecorInfo,
  updateHomeDecorInfo,
} = require("../controllers/homeDecorInfoController");

router.get("/", getHomeDecorInfo);
router.put("/", updateHomeDecorInfo);

module.exports = router;