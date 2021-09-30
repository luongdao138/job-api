const Job = require('../models/Job');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

module.exports = {
  getAllJobs: async (req, res) => {
    let result = Job.find({ createdBy: req.user._id }).sort('createdAt');
    const total_results = await Job.find({
      createdBy: req.user._id,
    }).countDocuments();
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = limit * (page - 1);

    result = result.skip(skip).limit(limit);

    const jobs = await result;
    res.status(StatusCodes.OK).json({
      jobs,
      pagination: {
        page,
        limit,
        total_results,
      },
    });
  },
  getJob: async (req, res) => {
    const { jobId } = req.params;
    const job = await Job.findOne({
      _id: jobId,
      createdBy: req.user._id,
    }).populate({
      path: 'createdBy',
      select: '_id name',
      model: User,
    });
    if (!job) {
      throw new NotFoundError(`Can not find the job with id ${jobId}`);
    }

    res.status(StatusCodes.OK).json({
      job,
    });
  },
  createJob: async (req, res) => {
    const user = req.user;
    let tempUser = new Job({ ...req.body, createdBy: user._id });
    tempUser = await tempUser.save();
    res.status(StatusCodes.CREATED).json(tempUser);
  },
  updateJob: async (req, res) => {
    const { jobId } = req.params;
    const { company, position } = req.body;
    if (company === '' || position === '') {
      throw new BadRequestError('Company or position cannot be empty!');
    }
    const job = await Job.findOneAndUpdate(
      { _id: jobId, createdBy: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!job) {
      throw new NotFoundError(`Can not find the job with id ${jobId}`);
    }

    res.status(StatusCodes.OK).json({
      job,
    });
  },
  deleteJob: async (req, res) => {
    const { jobId } = req.params;
    const job = await Job.findOneAndDelete({
      _id: jobId,
      createdBy: req.user._id,
    });
    if (!job) {
      throw new NotFoundError(`Can not find the job with id ${jobId}`);
    }

    res.status(StatusCodes.OK).json({
      msg: 'Delete job successfully!',
    });
  },
};
