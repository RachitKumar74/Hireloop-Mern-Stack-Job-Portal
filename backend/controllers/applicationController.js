const Application = require('../models/Application');
const Job = require('../models/Job');

const applyJob = async (req, res, next) => {
  try {
    const { jobId, coverLetter, resume } = req.body;
    if (!jobId) {
      res.status(400);
      throw new Error('Job ID is required');
    }

    const job = await Job.findById(jobId);
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }
    if (job.status !== 'approved') {
      res.status(400);
      throw new Error('This job is not open for applications');
    }

    const existing = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });
    if (existing) {
      res.status(400);
      throw new Error('You have already applied for this job');
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      resume: resume || req.user.resume || '',
      coverLetter: coverLetter || '',
      status: 'Applied',
    });

    res.status(201).json(application);
  } catch (err) {
    next(err);
  }
};

const getMyApplications = async (req, res, next) => {
  try {
    const apps = await Application.find({ applicant: req.user._id })
      .populate('job', 'title company location jobType salary status')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    next(err);
  }
};

const getApplicationsForJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }
    const isOwner = job.postedBy.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not allowed');
    }
    const apps = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email phone location skills resume')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    next(err);
  }
};

const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['Applied', 'Shortlisted', 'Rejected', 'Hired'];
    if (!allowed.includes(status)) {
      res.status(400);
      throw new Error('Invalid status');
    }
    const app = await Application.findById(req.params.id).populate('job');
    if (!app) {
      res.status(404);
      throw new Error('Application not found');
    }
    const isOwner = app.job.postedBy.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not allowed');
    }
    app.status = status;
    await app.save();
    res.json(app);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  applyJob,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
};