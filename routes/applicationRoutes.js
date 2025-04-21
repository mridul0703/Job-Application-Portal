const express = require('express');
const { 
  applyToJob, 
  getMyApplications, 
  getJobApplications, 
  withdrawApplication, 
  updateApplicationStatus,
  getApplicationStatus,
  
} = require('../controllers/applicationController');
const { protect, checkRole } = require('../middlewares/authMiddleware');

const router = express.Router();

//  job seeker only
router.post('/:id', protect, checkRole('job-seeker'), applyToJob);
router.get('/my', protect, checkRole('job-seeker'), getMyApplications);
router.delete('/:id', protect, checkRole('job-seeker'), withdrawApplication);
router.get('/:jobId/status', protect, checkRole('job-seeker'), getApplicationStatus);

// recruiter only
router.get('/:jobId/applications', protect, checkRole('recruiter'), getJobApplications);
router.put('/:id/status', protect, checkRole('recruiter'), updateApplicationStatus);



module.exports = router;
