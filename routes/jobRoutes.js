const express = require('express');
const { protect, checkRole } = require('../middlewares/authMiddleware');
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getRecruiterJobs,
  getRecentJobs,
  changeJobStatus,
} = require('../controllers/jobController');

const router = express.Router();


// api/jobs

// Recruiter only
router.post('/create', protect, checkRole('recruiter'), createJob);
router.put('/:id', protect, checkRole('recruiter'), updateJob);
router.delete('/:id', protect, checkRole('recruiter'), deleteJob);

router.get('/myjobs', protect, checkRole('recruiter'), getRecruiterJobs);
router.put('/:id/status', protect, checkRole('recruiter'), changeJobStatus);

// Public
router.get('/all', getJobs);
router.get('/recent', getRecentJobs);
router.get('/:id', getJobById);


module.exports = router;
