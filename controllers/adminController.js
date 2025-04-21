const Job = require('../models/Job');
const User = require('../models/User');
const Application = require('../models/Application');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalApplications = await Application.countDocuments();

    res.status(200).json({
      message: 'Dashboard stats retrieved successfully',
      stats: {
        totalJobs,
        totalUsers,
        totalApplications
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve stats', error: error.message });
  }
};


