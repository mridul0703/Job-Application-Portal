const User = require('../models/User');

// @desc    Get profile of logged-in user
// @route   GET /api/users/me
// @access  Private (Any logged-in user)
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -refreshToken');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Update profile of logged-in user
// @route   PUT /api/users/me
// @access  Private (Any logged-in user)
exports.updateUserProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    }).select('-password -refreshToken');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
};







// @desc    Get user profile by ID (Admin)
// @route   GET /api/users/admin/users/:id
// @access  Private (Admin only)
exports.getUserById = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

    const user = await User.findById(req.params.id).select('-password -refreshToken');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Delete user by ID (Admin)
// @route   DELETE /api/users/admin/users/:id
// @access  Private (Admin only)
exports.deleteUserById = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/users/admin/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
    const users = await User.find().select('-password -refreshToken');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
