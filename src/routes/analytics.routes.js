import express from "express";
import { getAdminAnalytics } from "../controllers/analytics.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Only admin should access this (you can add role-check middleware if you have one)
router.get("/admin", authMiddleware, getAdminAnalytics);

export default router;