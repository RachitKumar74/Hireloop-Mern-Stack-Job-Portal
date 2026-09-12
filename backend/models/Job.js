const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: String, default: '' },
    skills: [{ type: String }],
    location: { type: String, default: '' },
    salary: { type: String, default: '' },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Internship'],
      default: 'Full-time',
    },
    experience: { type: String, default: '' },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);