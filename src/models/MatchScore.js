import mongoose from "mongoose";

const matchScoreSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  matchPercentage: { type: Number, required: true }
}, { timestamps: true });

// Ensure one score per student per job
matchScoreSchema.index({ studentId: 1, jobId: 1 }, { unique: true });

export default mongoose.model("MatchScore", matchScoreSchema);