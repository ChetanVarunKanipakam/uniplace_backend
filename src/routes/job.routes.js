import express from "express";
import { postJob, getJobs,updateJob } from "../controllers/job.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, postJob);
router.get("/:id", getJobs);
router.put("/:jobId", authMiddleware, updateJob);

export default router;
