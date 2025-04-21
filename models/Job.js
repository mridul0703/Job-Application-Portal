const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  description: String,
  location: String,
  salary: Number,
  tags: [String],
  skills: [String],
  experienceLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior'],
    default: 'entry'
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open',
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'internship', 'contract'],
    default: 'full-time',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
