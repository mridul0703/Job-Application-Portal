const express = require('express');
const { 
  applyToJob, 
  getMyApplications, 
  getJobApplications, 
  getUserApplications, 
  withdrawApplication, 
  updateApplicationStatus,
  getApplicationStatus
} = require('../controllers/applicationController');
const { protect, checkRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// POST /api/apply/:jobId → job seeker only
router.post('/:jobId', protect, checkRole('job-seeker'), applyToJob);

// GET /api/apply/my → job seeker only
router.get('/my', protect, checkRole('job-seeker'), getMyApplications);

// GET /api/apply/:jobId → recruiter only
router.get('/:jobId/applications', protect, checkRole('recruiter'), getJobApplications);

// GET /api/apply/user/:userId → recruiter/admin only
router.get('/user/:userId', protect, checkRole('recruiter', 'admin'), getUserApplications);

// DELETE /api/apply/:id → job seeker/admin to withdraw application
router.delete('/:id', protect, checkRole('job-seeker', 'admin'), withdrawApplication);

// PUT /api/apply/:id/status → recruiter to update application status
router.put('/:id/status', protect, checkRole('recruiter'), updateApplicationStatus);

router.get('/:jobId/status', protect, checkRole('job-seeker'), getApplicationStatus);


module.exports = router;
