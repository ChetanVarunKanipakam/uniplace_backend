import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "admin", "recruiter"], default: "student" },
  cgpa: { type: Number },
  branch: { type: String },
  resumeUrl: { type: String },
  company: {type: mongoose.Schema.Types.ObjectId, ref: "Company"}
}, { timestamps: true });

export default mongoose.model("User", userSchema);
