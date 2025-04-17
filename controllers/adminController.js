const Job = require('../models/Job');
const User = require('../models/User');
const Application = require('../models/Application');
const AuditLog = require('../models/AuditLog'); // Assuming you have an AuditLog model to track admin actions

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

// @desc    Get audit logs (admin actions)
// @route   GET /api/admin/logs
// @access  Private (Admin only)
exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }); // Fetch logs sorted by most recent
    res.status(200).json({
      message: 'Audit logs retrieved successfully',
      logs
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve logs', error: error.message });
  }
};
