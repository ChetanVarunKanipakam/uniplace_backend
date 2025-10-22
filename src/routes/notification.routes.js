import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import Notification from "../models/Notification.js";
const router = express.Router();

// Get all notifications for the currently logged-in user
router.get('/',authMiddleware, async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user.id })
    .sort({ createdAt: -1 });
  res.json(notifications);
});

// Mark a specific notification as read
router.put('/:id/read', authMiddleware,async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user.id }, // Ensure user owns notification
    { read: true },
    { new: true }
  );
  if (!notification) {
    return res.status(404).json({ message: "Notification not found" });
  }
  res.json(notification);
});
export default router;
