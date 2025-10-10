import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  questions: [
    {
      q: String,
      options: [String],
      answer: String
    }
  ]
}, { timestamps: true });

export default mongoose.model("Test", testSchema);
