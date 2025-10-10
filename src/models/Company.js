import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: String,
  photoUrl: String,
  description: String
}, { timestamps: true });

export default mongoose.model("Company", companySchema);
