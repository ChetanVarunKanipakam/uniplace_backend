import mongoose from "mongoose";

const roundResultSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  roundNumber: { type: Number, required: true }, // Matches the round in Job model
  
  // List of students who qualified this specific round
  qualifiedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  
  // List of students rejected in this round
  rejectedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  
  published: { type: Boolean, default: false } // Admin can save draft before publishing to app
}, { timestamps: true });

export default mongoose.model("RoundResult", roundResultSchema);