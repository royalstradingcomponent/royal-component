const express =
require("express");

const router =
express.Router();

const {
createFollowUp,
getFollowUps
}
=
require(
"../controllers/crmFollowUpController"
);

router.post(
"/",
createFollowUp
);

router.get(
"/",
getFollowUps
);

module.exports =
router;