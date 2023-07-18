const express = require("express");
const { userAuth } = require("../middelwares/authMiddleware");
const {
  createJobController,
  getAlljobsController,
  updateJobController,
  deleteJobController,
  jobStatsController,
} = require("../controllers/jobsController");
const router = express.Router();

router.post("/", userAuth, createJobController);
router.get("/", userAuth, getAlljobsController);
router.patch("/:id", userAuth, updateJobController);
router.delete("/:id", userAuth, deleteJobController);
router.get("/job-stats", userAuth, jobStatsController);
module.exports = router;
