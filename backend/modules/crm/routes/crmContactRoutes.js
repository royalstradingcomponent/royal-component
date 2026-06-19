const express =
  require("express");

const router =
  express.Router();

const {
  getContacts,
  createContact,
  getContactById,
  updateContact,
  deleteContact,
} = require(
  "../controllers/crmContactController"
);

router.get(
  "/",
  getContacts
);

router.get(
  "/:id",
  getContactById
);

router.post(
  "/",
  createContact
);

router.put(
  "/:id",
  updateContact
);

router.delete(
  "/:id",
  deleteContact
);

module.exports =
  router;