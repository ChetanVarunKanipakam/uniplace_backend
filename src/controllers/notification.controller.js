import Notification from "../models/Notification.js";

export const createNotification = async (req, res) => {
  try {
    if (req.user?.role !== "admin") return res.status(403).json({ message: "Forbidden" });

    const { title, message } = req.body;
    const n = await Notification.create({ title, message });
    // Optionally: integrate FCM push here (not included)
    res.status(201).json({ message: "Notification created", notification: n });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const ns = await Notification.find().sort({ createdAt: -1 });
    res.json(ns);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
