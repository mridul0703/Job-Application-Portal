const express = require('express');
const { protect, checkRole } = require('../middlewares/authMiddleware');
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getRecruiterJobs,
  getRecentJobs
} = require('../controllers/jobController');

const router = express.Router();

router.post('/', protect, checkRole('recruiter'), createJob);
router.get('/all', getJobs);
router.get('/:id', getJobById);
router.put('/:id', protect, checkRole('recruiter'), updateJob);
router.delete('/:id', protect, checkRole('recruiter'), deleteJob);
router.get('/myjobs', protect, checkRole('recruiter'), getRecruiterJobs);
router.get('/recent', getRecentJobs);

module.exports = router;
