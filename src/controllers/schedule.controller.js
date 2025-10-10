import Schedule from "../models/Schedule.js";

export const addSchedule = async (req, res) => {
  try {
    // only admins allowed
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { companyId, event, date, time } = req.body;
    const schedule = await Schedule.create({ companyId, event, date, time });
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
