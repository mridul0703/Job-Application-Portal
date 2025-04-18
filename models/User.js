const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const educationSchema = new mongoose.Schema({
  institution: String,
  course: String,
  grade: Number,
});

const internshipSchema = new mongoose.Schema({
  company: String,
  role: String,
  duration: String,
  description: String,
});

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  technologies: [String],
  link: String,
});

const certificationSchema = new mongoose.Schema({
  title: String,
  issuer: String,
  date: String,
});

const awardSchema = new mongoose.Schema({
  title: String,
  issuer: String,
  date: String,
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  refreshToken: { type: String, default: null },

  role: {
    type: String,
    enum: ['job-seeker', 'recruiter', 'admin'],
    default: 'job-seeker',
  },

  // Shared
  skills: [String],
  resumeUrl: String,
  location: String,
  gender: String,
  dob: String,
  phone: String,
  languages: [String],
  bio: { type: String, maxlength: 200 },

  // Job Seeker Specific
  education: [educationSchema],
  internships: [internshipSchema],
  projects: [projectSchema],
  certifications: [certificationSchema],
  awards: [awardSchema],
  clubs: [String],

  // Recruiter Specific
  company: String,
  position: String,
  industry: String,
  companyWebsite: String,
}, { timestamps: true });

// Password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password check method
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
