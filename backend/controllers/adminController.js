const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

const getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalJobs, totalApplications, pendingJobs, approvedJobs, rejectedJobs] =
      await Promise.all([
        User.countDocuments({ role: { $ne: 'admin' } }),
        Job.countDocuments(),
        Application.countDocuments(),
        Job.countDocuments({ status: 'pending' }),
        Job.countDocuments({ status: 'approved' }),
        Job.countDocuments({ status: 'rejected' }),
      ]);

    const seekerCount = await User.countDocuments({ role: 'jobseeker' });
    const employerCount = await User.countDocuments({ role: 'employer' });

    res.json({
      totalUsers, totalJobs, totalApplications,
      pendingJobs, approvedJobs, rejectedJobs,
      seekerCount, employerCount,
    });
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    if (user.role === 'admin') {
      res.status(400);
      throw new Error('Cannot delete an admin');
    }
    await user.deleteOne();
    await Application.deleteMany({ applicant: user._id });
    await Job.deleteMany({ postedBy: user._id });
    res.json({ message: 'User removed' });
  } catch (err) {
    next(err);
  }
};

const getAllJobs = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    const jobs = await Job.find(filter)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
};

const updateJobStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status');
    }
    const job = await Job.findById(req.params.id);
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }
    job.status = status;
    await job.save();
    res.json(job);
  } catch (err) {
    next(err);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }
    await job.deleteOne();
    await Application.deleteMany({ job: job._id });
    res.json({ message: 'Job removed' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getStats, getUsers, deleteUser,
  getAllJobs, updateJobStatus, deleteJob,
};