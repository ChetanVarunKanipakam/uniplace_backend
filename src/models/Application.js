import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  resumeUrl: { type: String },
  
  // ✅ NEW: Progress Tracking
  currentRound: { type: Number, default: 1 }, // Starts at Round 1
  
  status: { 
    type: String, 
    enum: ["applied", "qualified", "rejected", "selected"], 
    default: "applied" 
  },
  
  // Optional: Store history if they failed a specific round
  roundHistory: [{
    roundNumber: Number,
    status: String, // "cleared", "failed"
    remarks: String
  }]
}, { timestamps: true });

// Prevent duplicate applications
applicationSchema.index({ studentId: 1, jobId: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);
