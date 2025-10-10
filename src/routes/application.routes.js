import express from "express";
import { applyToCompany, getApplicationsByCompany, updateApplicationStatus } from "../controllers/application.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/apply", authMiddleware, applyToCompany);                     // student applies
router.get("/company/:companyId", authMiddleware, getApplicationsByCompany); // recruiter/admin fetch
router.put("/:id/status", authMiddleware, updateApplicationStatus);       // update status

export default router;
