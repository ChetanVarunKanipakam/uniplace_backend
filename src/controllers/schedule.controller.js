import Schedule from "../models/Schedule.js";

import Notification from '../models/Notification.js'; // Adjust path
import User from '../models/User.js'; // Adjust path

export const addSchedule = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const { companyId, event, date, time } = req.body;
    const schedule = await Schedule.create({ companyId, event, date, time });

    const usersToNotify = await User.find({ role: { $in: ['admin', 'recruiter'] } });
    const notifications = usersToNotify.map(user => ({
      recipient: user._id,
      title: 'New Schedule Created',
      message: `A new schedule for ${event} is set for ${date} at ${time}.`,
      type: 'new_schedule',
    }));
    await Notification.insertMany(notifications);

    res.status(201).json({ message: "Schedule added successfully", schedule });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
export const getSchedules = async (req, res) => {
  try {
    const { companyId } = req.params;
    const schedules = await Schedule.find({ companyId });
    res.json(schedules);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
