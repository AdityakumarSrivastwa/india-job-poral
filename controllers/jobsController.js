const Job = require("../models/jobsModel");
const mongoose = require("mongoose");
const moment = require("moment");
exports.createJobController = async (req, res, next) => {
  try {
    const { company, position } = req.body;
    if (!company || !position) {
      next("Please Provide All Fields");
    }
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(201).json({ job });
  } catch (error) {
    next(error);
  }
};

//GET method
exports.getAlljobsController = async (req, res, next) => {
  // const jobs = await Job.find({ createdBy: req.user.userId });
  const { status, workType, search, sort } = req.query;
  //conditons for searching filters
  const queryObject = {
    createdBy: req.user.userId,
  };

  //logic filters
  if (status && status !== "all") {
    queryObject.status = status;
  }
  if (workType && workType !== "all") {
    queryObject.workType = workType;
  }
  if (search) {
    // find on the basis of place like Bihar
    queryObject.position = { $regex: search, $options: "i" };
  }

  let queryResult = Job.find(queryObject);

  //sorting
  if (sort === "latest") {
    queryResult = queryResult.sort("-createdAt");
  }
  if (sort === "oldest") {
    queryResult = queryResult.sort("createdAt");
  }
  if (sort === "a-z") {
    queryResult = queryResult.sort("position");
  }
  if (sort === "z-a") {
    queryResult = queryResult.sort("-position");
  }
  //pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10; // per page limit
  const skip = (page - 1) * limit;

  queryResult = queryResult.skip(skip).limit(limit);
  //jobs count
  const totalJobs = await Job.countDocuments(queryResult);
  const numOfPage = Math.ceil(totalJobs / limit);

  const jobs = await queryResult;

  // const jobs = await jobsModel.find({ createdBy: req.user.userId });
  res.status(200).json({
    totalJobs,
    jobs,
    numOfPage,
  });
};

//update using patch*****************************

exports.updateJobController = async (req, res, next) => {
  const { id } = req.params;
  const { company, position } = req.body;
  //validation
  if (!company || !position) {
    next("please provide all fields");
  }
  //find job
  const job = await Job.findOne({ _id: id });
  //validation
  if (!job) {
    next(`no jobs found with id ${id}`);
  }
  if (!req.user.userId === job.createdBy.toString()) {
    next("your not Authorization to update this job");
    return;
  }
  const updateJob = await Job.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ updateJob });
};

// delete operation

exports.deleteJobController = async (req, res, next) => {
  const { id } = req.params;
  //find job
  const job = await Job.findOne({ _id: id });
  //validation
  if (!job) {
    next(`no job found with this ID ${id}`);
  }
  if (!req.user.userId === job.createdBy.toString()) {
    next("you are not authorize to delete this job");
    return;
  }
  await job.deleteOne();
  res.status(200).json({
    message: "Success , Job Deleted ",
  });
};
// ***********JOB STATS FILTERS**********
exports.jobStatsController = async (req, res, next) => {
  const stats = await Job.aggregate([
    //search by user jobs
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    }, //match object end
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    }, //group object end
  ]);

  //default stats
  const defaultStats = {
    pending: stats.pending || 0,
    reject: stats.reject || 0,
    interview: stats.interview || 0,
  };

  //monthly yearly stats*********************
  let monthlyApplication = await Job.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: {
          $sum: 1,
        },
      },
    },
  ]);
  monthlyApplication = monthlyApplication
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();
  res
    .status(200)
    .json({ totlJobs: stats.length, defaultStats, monthlyApplication });
};
