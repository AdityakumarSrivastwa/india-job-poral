const express = require("express");
const { userAuth } = require("../middelwares/authMiddleware");
const { updateUserController } = require("../controllers/userControllers");
const router = express.Router();

//GET user

//Update user || PUT
// router.put("/:id", updateUserController);
router.put("/", userAuth, updateUserController);

module.exports = router;
