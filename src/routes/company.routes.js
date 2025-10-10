import express from "express";
import { getCompanies, addCompany, deleteCompany } from "../controllers/company.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import multer from "multer";
import path from "path";
const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("file"), (req, res) => {
  const filePath = `/uploads/${req.file.filename}`;
  res.status(200).json({ url: filePath });
});
router.get("/", getCompanies);
router.post("/", authMiddleware, addCompany);
router.delete("/:id", authMiddleware, deleteCompany);

export default router;
