const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply to a job
// @route   POST /api/apply/:jobId
// @access  Private (Job Seekers only)
exports.applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params; // jobId comes from the URL param
    const { resumeUrl } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check for duplicate application
    const alreadyApplied = await Application.findOne({
      job: jobId,
      applicant: req.user._id
    });

    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      resumeUrl
    });

    res.status(201).json({ message: 'Applied successfully', application });
  } catch (error) {
    res.status(500).json({ message: 'Failed to apply', error: error.message });
  }
};

// @desc    Get all applications made by the current job-seeker
// @route   GET /api/apply/my
// @access  Private (Job Seekers only)
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('job', 'title company')
      .select('job resumeUrl status createdAt');

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch applications', error: error.message });
  }
};

// @desc    Get all applications for a specific job (recruiter only)
// @route   GET /api/apply/:jobId/applications
// @access  Private (Recruiter who posted the job)
exports.getJobApplications = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Only the recruiter who created this job can view applicants
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view applications for this job' });
    }

    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch job applications', error: error.message });
  }
};

// @desc    Get all applications by a user (recruiter/admin only)
// @route   GET /api/apply/user/:userId
// @access  Private (Recruiter/Admin only)
exports.getUserApplications = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Only admins or recruiters can access this
    if (!['admin', 'recruiter'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applications = await Application.find({ applicant: userId })
      .populate('job', 'title company')
      .select('job status createdAt');

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user applications', error: error.message });
  }
};

// @desc    Withdraw or delete an application
// @route   DELETE /api/apply/:id
// @access  Private (Job Seeker/Admin only)
exports.withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if the user is the applicant or admin
    if (application.applicant.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this application' });
    }

    await application.remove();
    res.status(200).json({ message: 'Application withdrawn successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to withdraw application', error: error.message });
  }
};

// @desc    Update application status (accept/reject)
// @route   PUT /api/apply/:id/status
// @access  Private (Recruiter who owns the job)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if the recruiter owns the job
    if (application.job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    application.status = status;
    await application.save();

    res.status(200).json({ message: 'Application status updated', application });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status', error: error.message });
  }
};
