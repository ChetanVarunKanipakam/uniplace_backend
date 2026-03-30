import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  roundName: String, // "Tech Round for Google"
  date: Date,
  time: String,
  venue: String
}, { timestamps: true });

export default mongoose.model("Schedule", scheduleSchema);