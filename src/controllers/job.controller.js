import Job from "../models/Job.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
export const postJob = async (req, res) => {
  try {
    if (!["recruiter", "admin"].includes(req.user?.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const job = await Job.create(req.body);

    const students = await User.find({ role: 'student' }); // Or your desired role
    const notifications = students.map(student => ({
      recipient: student._id,
      title: 'New Job Posted',
      message: `A new job has been posted: ${job.role}.`,
      type: 'new_job',
    }));
    await Notification.insertMany(notifications);

    res.status(201).json({ message: "Job posted successfully", job });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getJobs = async (req, res) => {
  const companyId = req.params.id; // get companyId from URL params

  try {
    const jobs = await Job.find({ companyId }).populate("companyId", "name");
    console.log(jobs,companyId);
    res.json(jobs);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
