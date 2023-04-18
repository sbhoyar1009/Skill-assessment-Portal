const express = require("express");
const User = require("../models/User");
const router = express.Router({ mergeParams: true });

router.use(require("./api/Result"));
router.use(require("./api/Test"));
router.use(require("./api/Assignment"))
router.use(require("./gitlabApis/registerUserGitlab"));
router.use(require("./gitlabApis/nab1UsersRegister"));
require("./api/Auth")(router);

module.exports = router;
