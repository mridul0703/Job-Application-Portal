const Job = require('../models/Job');

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private (Recruiter only)
exports.createJob = async (req, res) => {
  try {
    const { title, company, description, location, salary, tags } = req.body;

    const job = new Job({
      title,
      company,
      description,
      location,
      salary,
      tags,
      createdBy: req.user._id
    });

    const savedJob = await job.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create job', error: error.message });
  }
};

// @desc    Get all job listings (with optional filters)
// @route   GET /api/jobs/all?location=...&title=...&company=...&tags=React,Node
// @access  Public
exports.getJobs = async (req, res) => {
  try {
    const { location, title, company, tags } = req.query;
    let query = {};

    if (location) {
      query.location = new RegExp(location, 'i');
    }

    if (title) {
      query.title = new RegExp(title, 'i');
    }

    if (company) {
      query.company = new RegExp(company, 'i');
    }

    if (tags) {
      const tagList = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagList };
    }

    const jobs = await Job.find(query);
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch jobs', error: error.message });
  }
};


// @desc    Get a job by ID
// @route   GET /api/jobs/:id
// @access  Public
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('createdBy', 'name email');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch job', error: error.message });
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter who created it)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Only the creator can delete the job
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await Job.deleteOne({ _id: job._id });

    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete job', error: error.message });
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter who created it)
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    const updates = req.body;
    Object.assign(job, updates);

    const updatedJob = await job.save();
    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update job', error: error.message });
  }
};

// @desc    Get jobs created by logged-in recruiter
// @route   GET /api/jobs/myjobs
// @access  Private (Recruiter only)
exports.getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user._id });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch recruiter jobs' });
  }
};
