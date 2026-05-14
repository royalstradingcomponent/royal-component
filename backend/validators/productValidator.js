const { body } = require("express-validator");

exports.createProductValidator = [
  body("name")
    .notEmpty()
    .withMessage("Product name is required"),

  body("category")
    .notEmpty()
    .withMessage("Category is required"),

  body("price")
    .isNumeric()
    .withMessage("Price must be number"),

  body("stock")
    .isNumeric()
    .withMessage("Stock must be number"),
];