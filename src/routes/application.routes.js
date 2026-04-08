import express from "express";
import { 
  applyToCompany, 
  getApplicationsByCompany, 
  updateApplicationStatus,
  getStudentApplications
} from "../controllers/application.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getMatchScore, calculateMatchScore } from "../controllers/application.controller.js";


router.get("/match/:jobId", authMiddleware, getMatchScore);
router.post("/match/:jobId", authMiddleware, calculateMatchScore);
const router = express.Router();

// Student routes
router.post("/apply", authMiddleware, applyToCompany);
router.get("/my-applications", authMiddleware, getStudentApplications); 

// Recruiter/Admin routes
router.get("/company/:companyId", authMiddleware, getApplicationsByCompany); 
router.put("/:id/status", authMiddleware, updateApplicationStatus);

export default router;