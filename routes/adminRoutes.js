const express = require("express");
const { getDashboardStats } = require("../controllers/adminController");
const { getAllApplications } = require("../controllers/applicationController");
const { getAllUsers, getUserById, deleteUserById } = require("../controllers/userController");
const { getJobs, getJobById, deleteJob } = require("../controllers/jobController");
const { protect, checkRole } = require("../middlewares/authMiddleware");

const router = express.Router();

// routes/adminRoutes.js

// USERS
router.get("/users", protect, checkRole("admin"), getAllUsers);
router.get("/users/:id", protect, checkRole("admin"), getUserById);
router.delete("/users/:id", protect, checkRole("admin"), deleteUserById);

// JOBS
router.get("/jobs", protect, checkRole("admin"), getJobs);
router.get("/jobs/:id", protect, checkRole("admin"), getJobById);
router.delete("/jobs/:id", protect, checkRole("admin"), deleteJob);

// APPLICATIONS
router.get("/applications", protect, checkRole("admin"), getAllApplications);

// STATS
router.get("/stats", protect, checkRole("admin"), getDashboardStats);


module.exports = router;
