import express from "express";
import { 
  applyToCompany, 
  getApplicationsByCompany, 
  updateApplicationStatus,
  getStudentApplications // ✅ Make sure to implement this in controller
} from "../controllers/application.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Student routes
router.post("/apply", authMiddleware, applyToCompany);
router.get("/my-applications", authMiddleware, getStudentApplications); 

// Recruiter/Admin routes
router.get("/company/:companyId", authMiddleware, getApplicationsByCompany); 
router.put("/:id/status", authMiddleware, updateApplicationStatus);

export default router;