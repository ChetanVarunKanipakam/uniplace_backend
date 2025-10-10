import express from "express";
import { postJob, getJobs } from "../controllers/job.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, postJob);
router.get("/:id", getJobs);

export default router;
