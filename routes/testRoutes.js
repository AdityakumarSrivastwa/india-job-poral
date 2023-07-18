const express = require("express");
const testgetController = require("../controllers/testController");
const { userAuth } = require("../middelwares/authMiddleware");
const router = express.Router();

router.post("/", userAuth, testgetController.testgetController);

module.exports = router;
