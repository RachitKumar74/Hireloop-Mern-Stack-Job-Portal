const Job = require('../models/Job');

const getJobs = async (req, res, next) => {
  try {
    const { q, location, type, status } = req.query;
    const filter = {};
    if (!status || status === 'approved') {
      filter.status = 'approved';
    } else if (status !== 'all') {
      filter.status = status;
    }

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { company: { $regex: q, $options: 'i' } },
        { skills: { $regex: q, $options: 'i' } },
      ];
    }
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (type && type !== 'All') filter.jobType = type;

    const jobs = await Job.find(filter)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
};

const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email');
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }
    res.json(job);
  } catch (err) {
    next(err);
  }
};

const createJob = async (req, res, next) => {
  try {
    const {
      title, company, description, requirements,
      skills, location, salary, jobType, experience,
    } = req.body;

    if (!title || !company || !description) {
      res.status(400);
      throw new Error('Title, company and description are required');
    }

    const job = await Job.create({
      title, company, description, requirements,
      skills: Array.isArray(skills)
        ? skills
        : (skills || '').split(',').map((s) => s.trim()).filter(Boolean),
      location, salary, jobType, experience,
      postedBy: req.user._id,
      status: req.user.role === 'admin' ? 'approved' : 'pending',
    });

    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }
    const isOwner = job.postedBy.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not allowed to edit this job');
    }

    const fields = ['title', 'company', 'description', 'requirements',
      'location', 'salary', 'jobType', 'experience', 'status'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) job[f] = req.body[f];
    });
    if (req.body.skills !== undefined) {
      job.skills = Array.isArray(req.body.skills)
        ? req.body.skills
        : req.body.skills.split(',').map((s) => s.trim()).filter(Boolean);
    }

    const saved = await job.save();
    res.json(saved);
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
    const isOwner = job.postedBy.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not allowed to delete this job');
    }
    await job.deleteOne();
    res.json({ message: 'Job removed' });
  } catch (err) {
    next(err);
  }
};

const getMyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
};

module.exports = { getJobs, getJobById, createJob, updateJob, deleteJob, getMyJobs };