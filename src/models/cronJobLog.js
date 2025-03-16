const mongoose = require('mongoose');

const cronJobLogSchema = new mongoose.Schema({
  jobName: {
    type: String,
    required: true,
    unique: true,
  },
  lastRun: {
    type: Date,
    required: true,
  },
});

const CronJobLog = mongoose.model('CronJobLog', cronJobLogSchema);

module.exports = CronJobLog;
