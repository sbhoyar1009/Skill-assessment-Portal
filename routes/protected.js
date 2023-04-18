const express = require("express");
const { checkApi } = require("../middleware");
const router = express.Router({ mergeParams: true });

router.use("/", checkApi, require("./api/Assignment"));
router.use("/", checkApi,require("./api/Test"));

module.exports = router;
