const express = require('express');
const router = express.Router();
const {
  register, login, me, updateMe, uploadResume,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, me);
router.put('/me', protect, updateMe);
router.post('/upload-resume', protect, upload.single('resume'), uploadResume);

module.exports = router;