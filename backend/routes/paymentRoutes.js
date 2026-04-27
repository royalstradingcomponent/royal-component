const express = require("express");
const router = express.Router();

const { getPaymentMethods } = require("../controllers/paymentController");

router.get("/methods", getPaymentMethods);

module.exports = router;