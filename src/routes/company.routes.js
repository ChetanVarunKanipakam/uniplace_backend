import express from "express";
import { getCompanies, addCompany, deleteCompany } from "../controllers/company.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Resolve project root directory (for ES modules)
const __dirname = path.resolve();

// Absolute path to uploads folder
const uploadDir = path.join(__dirname, "uploads");

// Ensure uploads folder exists at runtime
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // use absolute path
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // This is the URL path the client will use
  const filePath = `/uploads/${req.file.filename}`;
  res.status(200).json({ url: filePath });
});

router.get("/", getCompanies);
router.post("/", authMiddleware, addCompany);
router.delete("/:id", authMiddleware, deleteCompany);

export default router;
