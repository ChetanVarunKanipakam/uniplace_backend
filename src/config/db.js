import mongoose from "mongoose";
import { start as startScheduler } from './scheduler.js';
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");

    startScheduler();
  } catch (err) {
    console.error("❌ MongoDB Connection Failed", err.message);
    process.exit(1);
  }
};

export default connectDB;
