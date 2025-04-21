const Job = require("../models/Job");

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private (Recruiter only)
exports.createJob = async (req, res) => {
	try {
		const { title, company, description, location, salary, tags, skills, experienceLevel, jobType, status } = req.body;

		const job = new Job({
			title,
			company,
			description,
			location,
			salary,
			tags,
			skills,
			experienceLevel,
			jobType,
			status,
			createdBy: req.user._id,
		});

		const savedJob = await job.save();
		res.status(201).json(savedJob);
	} catch (error) {
		res.status(500).json({ message: "Failed to create job", error: error.message });
	}
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter only)
exports.updateJob = async (req, res) => {
	try {
		const job = await Job.findById(req.params.id);
		if (!job) return res.status(404).json({ message: "Job not found" });

		if (job.createdBy.toString() !== req.user._id.toString()) {
			return res.status(403).json({ message: "Not authorized to update this job" });
		}

		Object.assign(job, req.body);
		const updatedJob = await job.save();
		res.status(200).json(updatedJob);
	} catch (error) {
		res.status(500).json({ message: "Failed to update job", error: error.message });
	}
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter only)
exports.deleteJob = async (req, res) => {
	try {
		const job = await Job.findById(req.params.id);
		if (!job) return res.status(404).json({ message: "Job not found" });

		if (job.createdBy.toString() !== req.user._id.toString()) {
			return res.status(403).json({ message: "Not authorized to delete this job" });
		}

		await Job.deleteOne({ _id: job._id });
		res.status(200).json({ message: "Job deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Failed to delete job", error: error.message });
	}
};

// @desc    Get recruiter’s own jobs
// @route   GET /api/jobs/myjobs
// @access  Private (Recruiter only)
exports.getRecruiterJobs = async (req, res) => {
	try {
		const jobs = await Job.find({ createdBy: req.user._id });
		res.status(200).json(jobs);
	} catch (err) {
		res.status(500).json({ message: "Failed to fetch recruiter jobs" });
	}
};

// @desc    Change job status
// @route   PUT /api/jobs/:id/status
// @access  Private (Recruiter only)
exports.changeJobStatus = async (req, res) => {
	try {
		const job = await Job.findById(req.params.id);
		if (!job) return res.status(404).json({ message: "Job not found" });

		if (job.createdBy.toString() !== req.user._id.toString()) {
			return res.status(403).json({ message: "Not authorized" });
		}

		job.status = req.body.status;
		await job.save();

		res.json({ message: "Status updated", job });
	} catch (err) {
		res.status(500).json({ message: "Failed to update status", error: err.message });
	}
};

// @desc    Get all jobs (with filters)
// @route   GET /api/jobs/all
// @access  Public
exports.getJobs = async (req, res) => {
	try {
		const { q, location, company, skills, tags, experienceLevel } = req.query;
		let query = {};

		if (q) {
			const regex = new RegExp(q, "i");
			query.$or = [
				{ title: regex },
				{ company: regex },
				{ location: regex },
				{ tags: { $in: [regex] } },
				{ skills: { $in: [regex] } }
			];
		}

		if (location) query.location = new RegExp(location, "i");
		if (company) query.company = new RegExp(company, "i");
		if (tags) query.tags = { $in: tags.split(",").map(tag => tag.trim()) };
		if (skills) query.skills = { $in: skills.split(",").map(skill => skill.trim()) };
		if (experienceLevel) query.experienceLevel = experienceLevel;

		const jobs = await Job.find(query).populate("createdBy", "email name");

		res.json(jobs);
	} catch (error) {
		res.status(500).json({ message: "Failed to fetch jobs", error: error.message });
	}
};




// @desc    Get recent jobs
// @route   GET /api/jobs/recent?limit=5
// @access  Public
exports.getRecentJobs = async (req, res) => {
	try {
		const limit = parseInt(req.query.limit) || 5;
		const jobs = await Job.find().sort({ createdAt: -1 }).limit(limit);
		res.json({ jobs });
	} catch (error) {
		res.status(500).json({ message: "Failed to fetch recent jobs", error: error.message });
	}
};

// @desc    Get a job by ID
// @route   GET /api/jobs/:id
// @access  Public
exports.getJobById = async (req, res) => {
	try {
		const job = await Job.findById(req.params.id).populate("createdBy", "name email");
		if (!job) return res.status(404).json({ message: "Job not found" });

		res.status(200).json(job);
	} catch (error) {
		res.status(500).json({ message: "Failed to fetch job", error: error.message });
	}
};
