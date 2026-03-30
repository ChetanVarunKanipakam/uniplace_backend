import mongoose from "mongoose";

const roundSchema = new mongoose.Schema({
  roundNumber: { type: Number, required: true }, // 1, 2, 3...
  name: { type: String, required: true }, // "Aptitude Test", "Technical Interview"
  type: { 
    type: String, 
    enum: ["screening", "test", "interview", "gd"], 
    default: "screening" 
  },
  description: String,
  date: Date, 
  venue: String, // "Room 304" or "Zoom Link"
  testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test" }, // Optional: Link to a test
});

const jobSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  role: { type: String, required: true },
  package: String,
  eligibility: {
    cgpa: Number,
    branches: [String]
  },
  deadline: Date,
  description: String,
  skillsRequired: [String],
  
  // ✅ NEW: The Selection Pipeline
  rounds: [roundSchema], 
  
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Job", jobSchema);