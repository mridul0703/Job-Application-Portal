const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const educationSchema = new mongoose.Schema({
  institution: String,
  degree: String,
  startYear: Number,
  endYear: Number,
});

const internshipSchema = new mongoose.Schema({
  company: String,
  role: String,
  duration: String,
  description: String,
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
  skills: [String],
  resumeUrl: String,
  languages: [String],

  // Only for Job Seekers
  education: [educationSchema],
  internships: [internshipSchema],

  // Only for Recruiters
  company: String,
  position: String,
}, { timestamps: true });

// Password Hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
