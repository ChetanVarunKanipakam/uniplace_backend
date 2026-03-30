import express from "express";
import { 
  promoteStudents, // ✅ NEW Controller function
  getResults, 
  getResults1 
} from "../controllers/result.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ✅ NEW: Promote students to next round (Replaces simple publish)
router.post("/promote", authMiddleware, promoteStudents); 

// Keep these for fetching history/final selects
router.get("/selects", authMiddleware, getResults1);
router.get("/:companyId", authMiddleware, getResults);

export default router;
