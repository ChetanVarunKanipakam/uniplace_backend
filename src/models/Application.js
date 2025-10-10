import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  resumeUrl: { type: String },
  status: { type: String, enum: ["applied", "shortlisted", "selected", "rejected"], default: "applied" }
}, { timestamps: true });

export default mongoose.model("Application", applicationSchema);
