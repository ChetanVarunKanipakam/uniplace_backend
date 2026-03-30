import express from "express";
import { createTest, getTest, submitTest } from "../controllers/test.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createTest);          // admin create test
router.get("/:id", authMiddleware, getTest);           // get test (sanitized for students)
router.post("/submit/:id", authMiddleware, submitTest);

export default router;
