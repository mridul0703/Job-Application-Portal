const Application = require("../models/Application");
const Job = require("../models/Job");

// @desc    Apply to a job
// @route   POST /api/apply/:jobId
// @access  Private (Job Seekers only)
exports.applyToJob = async (req, res) => {
	const { id } = req.params;
	const { resumeUrl } = req.body;
	const userId = req.user._id;

	if (!resumeUrl) {
		return res.status(400).json({ message: "Resume URL is required" });
	}

	const existing = await Application.findOne({ job: id, user: userId });
	if (existing) {
		return res.status(400).json({ message: "You have already applied to this job" });
	}

	const job = await Job.findById(id);
	if (!job) {
		return res.status(404).json({ message: "Job not found" });
	}

	const application = await Application.create({
		applicant: userId,
		job: id,
		resume: resumeUrl,
		status: "pending",
	});

	res.status(201).json({ application });
};

// @desc    Get all applications made by the current job-seeker
// @route   GET /api/apply/my
// @access  Private (Job Seekers only)
exports.getMyApplications = async (req, res) => {
	try {
		const applications = await Application.find({ applicant: req.user._id }).populate("job", "title company location").select("job resumeUrl status createdAt");

		res.status(200).json(applications);
	} catch (error) {
		res.status(500).json({ message: "Failed to fetch applications", error: error.message });
	}
};

// @desc    Withdraw or delete an application
// @route   DELETE /api/apply/:id
// @access  Private (Job Seeker/Admin only)
exports.withdrawApplication = async (req, res) => {
	try {
		const application = await Application.findById(req.params.id);

		if (!application) {
			return res.status(404).json({ message: "Application not found" });
		}

		// Permission check
		if (application.applicant.toString() !== req.user._id.toString() && req.user.role !== "admin") {
			return res.status(403).json({ message: "Not authorized to delete this application" });
		}

		await Application.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: "Application withdrawn successfully" });
	} catch (error) {
		console.error("Withdraw application error:", error);
		res.status(500).json({ message: "Failed to withdraw application", error: error.message });
	}
};

// @desc    Check if user applied to a job and return status
// @route   GET /api/apply/:jobId/status
// @access  Private (Job Seekers only)
exports.getApplicationStatus = async (req, res) => {
	try {
		const jobId = req.params.jobId; // This matches the route definition

		const application = await Application.findOne({
			job: jobId,
			applicant: req.user._id,
		}).select("status _id");

		if (!application) {
			return res.status(200).json({ status: null, applied: false });
		}

		res.status(200).json({
			applied: true,
			status: application.status,
			applicationId: application._id,
		});
	} catch (error) {
		res.status(500).json({ message: "Failed to fetch application status", error: error.message });
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
			return res.status(404).json({ message: "Job not found" });
		}

		// Only the recruiter who created this job can view applicants
		if (job.createdBy.toString() !== req.user._id.toString()) {
			return res.status(403).json({ message: "Not authorized to view applications for this job" });
		}

		const applications = await Application.find({ job: jobId }).populate("applicant", "name email").sort({ createdAt: -1 });

		res.status(200).json(applications);
	} catch (error) {
		res.status(500).json({ message: "Failed to fetch job applications", error: error.message });
	}
};

// @desc    Update application status (accept/reject)
// @route   PUT /api/apply/:id/status
// @access  Private (Recruiter who owns the job)
exports.updateApplicationStatus = async (req, res) => {
	try {
		const { status } = req.body;

		if (!["pending", "accepted", "rejected"].includes(status)) {
			return res.status(400).json({ message: "Invalid status" });
		}

		const application = await Application.findById(req.params.id).populate("job");

		if (!application) {
			return res.status(404).json({ message: "Application not found" });
		}

		// Check if the recruiter owns the job
		if (application.job.createdBy.toString() !== req.user._id.toString()) {
			return res.status(403).json({ message: "Not authorized to update this application" });
		}

		application.status = status;
		await application.save();

		res.status(200).json({ message: "Application status updated", application });
	} catch (error) {
		res.status(500).json({ message: "Failed to update status", error: error.message });
	}
};

exports.getAllApplications = async (req, res) => {
	try {
		if (req.user.role !== "admin") {
			return res.status(403).json({ message: "Access denied. Admins only." });
		}
		const applications = await Application.find()
			.populate("job") // optional: include job info
			.populate("applicant"); // optional: include user info

		res.status(200).json(applications);
	} catch (error) {
		console.error("Error fetching applications:", error);
		res.status(500).json({ message: "Server error while fetching applications" });
	}
};
