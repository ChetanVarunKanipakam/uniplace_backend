import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ✅ Get logged-in user profile
router.get("/me", authMiddleware, async (req, res) => {
  try {
    console.log(req.user);
    res.json(req.user); // comes from middleware
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
