import express from "express";
import { getCompanies, addCompany, deleteCompany } from "../controllers/company.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

// Load env vars
dotenv.config();

const router = express.Router();

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Configure Storage (Optimized for Images/Logos)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "companies", // Folder name in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "webp"], // Allow image formats
    // resource_type: "auto", // Uncomment this if you plan to upload PDFs here too
  },
});

const upload = multer({ storage });

// 3. Upload Route
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Cloudinary returns the full HTTP URL in req.file.path
  const fileUrl = req.file.path;

  res.status(200).json({ 
    message: "Company image uploaded successfully",
    url: fileUrl 
  });
});

// 4. Other Routes
router.get("/", getCompanies);
router.post("/", authMiddleware, addCompany);
router.delete("/:id", authMiddleware, deleteCompany);

export default router;