const express = require('express');
const {
  getUserProfile,
  updateUserProfile
} = require('../controllers/userController');
const { protect, checkRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// Job-seeker / Recruiter - access their own profile
router.get('/me', protect, getUserProfile);
router.put('/me', protect, updateUserProfile);

module.exports = router;
