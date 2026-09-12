const express = require('express');
const router = express.Router();
const {
  applyJob, getMyApplications, getApplicationsForJob, updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('jobseeker'), applyJob);
router.get('/mine', protect, authorize('jobseeker'), getMyApplications);
router.get('/job/:jobId', protect, authorize('employer', 'admin'), getApplicationsForJob);
router.put('/:id/status', protect, authorize('employer', 'admin'), updateApplicationStatus);

module.exports = router;