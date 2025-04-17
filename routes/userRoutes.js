const express = require('express');
const { protect, checkRole } = require('../middlewares/authMiddleware');
const {
  getMyProfile,
  updateMyProfile,
  getAllUsers,
  deleteUserById
} = require('../controllers/userController.js');

const router = express.Router();

// User Profile Routes
router.get('/me', protect, getMyProfile);
router.put('/me', protect, updateMyProfile);

// Admin Routes
router.get('/all', protect, checkRole('admin'), getAllUsers);
router.delete('/:id', protect, checkRole('admin'), deleteUserById);

module.exports = router;
