const express = require("express");
const router = express.Router();

const { getPolicyPageBySlug } = require("../controllers/adminController");
const { seedPolicies } = require("../controllers/policySeedController");

router.get("/seed", seedPolicies);
router.get("/:slug", getPolicyPageBySlug);

module.exports = router;