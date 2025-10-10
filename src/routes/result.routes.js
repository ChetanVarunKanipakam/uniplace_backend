import express from "express";
import { publishResults, getResults ,getResults1} from "../controllers/result.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, publishResults);      // admin only

router.get("/selects",authMiddleware,getResults1);

router.get("/:companyId", authMiddleware, getResults);
export default router;
