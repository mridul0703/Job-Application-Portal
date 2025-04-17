const express = require('express');
const { getDashboardStats, getAuditLogs } = require('../controllers/adminController');
const { protect, checkRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// GET /api/admin/stats → Admin
// Get dashboard analytics such as jobs posted, users, applications
router.get('/stats', protect, checkRole('admin'), getDashboardStats);

// GET /api/admin/logs → Admin
// View audit logs
router.get('/logs', protect, checkRole('admin'), getAuditLogs);

module.exports = router;
