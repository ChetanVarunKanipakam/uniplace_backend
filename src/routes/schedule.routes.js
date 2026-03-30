import express from "express";
import { addSchedule, getSchedules } from "../controllers/schedule.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, addSchedule);           // admin only inside controller
router.get("/:companyId", authMiddleware, getSchedules);

export default router;
