// models/notificationModel.js

import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['new_company', 'new_job', 'shortlist', 'new_schedule', 'schedule_reminder', 'job_deadline'],
    required: true,
  },
  read: { type: Boolean, default: false },
  // Optional references for preventing duplicates
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule' }
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);