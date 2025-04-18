const User = require('../models/User');

// @desc    Get current user's profile
// @route   GET /api/users/me
// @access  Private
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Admins do not have a profile.' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get user profile', error: error.message });
  }
};

// @desc    Update current user's profile
// @route   PUT /api/users/me
// @access  Private
exports.updateMyProfile = async (req, res) => {
  try {
    const {
      name, skills, resumeUrl, location, gender, dob, phone,
      education, languages, internships, projects, bio,
      certifications, awards, clubs,
      company, position, industry, companyWebsite
    } = req.body;

    const updates = {
      name, skills, resumeUrl, location, gender, dob, phone,
      education, languages, internships, projects, bio,
      certifications, awards, clubs
    };

    if (req.user.role === 'recruiter') {
      updates.company = company;
      updates.position = position;
      updates.industry = industry;
      updates.companyWebsite = companyWebsite;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    }).select('-password');

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};


// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get users', error: error.message });
  }
};

// @desc    Delete a user by ID (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.deleteOne();

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};
