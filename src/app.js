import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./config/db.js";

import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth.routes.js";
import companyRoutes from "./routes/company.routes.js";
import scheduleRoutes from "./routes/schedule.routes.js";
import testRoutes from "./routes/test.routes.js";
import resultRoutes from "./routes/result.routes.js";
import jobRoutes from "./routes/job.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import candidateRoutes from "./routes/candidate.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import userRoutes from "./routes/user.routes.js";
import { v2 as cloudinary } from "cloudinary";
connectDB();
console.log("ENV CHECK:", process.env.CLOUDINARY_NAME, process.env.CLOUDINARY_KEY);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
const app = express();

app.use(cors());
app.use(express.json());
const __dirname = path.resolve();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// mount routes
app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/resumes", uploadRoutes);
app.use("/api/users", userRoutes);
app.get("/", (req, res) => res.send("University Placement API"));

export default app;
export {cloudinary};
