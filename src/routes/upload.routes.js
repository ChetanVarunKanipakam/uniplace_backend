import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { uploadResume } from "../controllers/upload.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Get absolute path to project root (for ES modules)
const __dirname = path.resolve();

// Define absolute uploads directory
const uploadDir = path.join(__dirname, "uploads");

// Ensure uploads folder exists at runtime
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // use absolute path
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // keep extension + name
  },
});

export const upload = multer({ storage });

// route: POST /api/resume/upload (for example)
router.post(
  "/upload",
  authMiddleware,
  upload.single("resumeFile"), // field name from frontend
  uploadResume
);

export default router;
