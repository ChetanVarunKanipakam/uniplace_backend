import express from "express";
import multer from "multer";
import { uploadResume } from "../controllers/upload.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // keep extension
  },
});

export const upload = multer({ storage });
const router = express.Router();


router.post("/upload", authMiddleware, upload.single("resumeFile"), uploadResume);


export default router;
