import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  role: String,
  package: String,
  eligibility: {
    cgpa: Number,
    branches: [String]
  },
  deadline: Date,
  description: String,
  skillsRequired: [String],
}, { timestamps: true });

export default mongoose.model("Job", jobSchema);
