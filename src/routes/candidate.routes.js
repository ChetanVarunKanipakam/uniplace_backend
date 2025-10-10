import express from "express";
import { fetchCandidates } from "../controllers/candidate.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/:jobId", authMiddleware, fetchCandidates);

export default router;
