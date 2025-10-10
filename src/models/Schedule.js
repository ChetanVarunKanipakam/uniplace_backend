import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  event: String,
  date: String,
  time: String
}, { timestamps: true });

export default mongoose.model("Schedule", scheduleSchema);
