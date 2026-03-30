import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import { uploadResume } from "../controllers/upload.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
// Get absolute path to project root (for ES modules)
dotenv.config();

const router = express.Router();

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir); // use absolute path
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname); // keep extension + name
//   },
// });
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params:async (req, file) => { return {
    folder: "resumes", // The folder name in your Cloudinary Dashboard
    public_id:  Date.now() + "-" + file.originalname, // Limit file types
    resource_type: "raw", // Use 'raw' for non-image files like PDFs/Docs usually
    // public_id: (req, file) => file.originalname, // Optional: customize filename
  };
},});

export const upload = multer({ storage });

// route: POST /api/resume/upload (for example)
router.post(
  "/upload",
  authMiddleware,
  upload.single("resumeFile"), // field name from frontend
  uploadResume
);

export default router;
