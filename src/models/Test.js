import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
  // Who created the test?
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Admin or Company
  title: String,
  durationMinutes: Number,
  questions: [
    {
      questionText: String,
      options: [String],
      correctOptionIndex: Number, // 0, 1, 2, or 3
      marks: { type: Number, default: 1 }
    }
  ]
}, { timestamps: true });

export default mongoose.model("Test", testSchema);
