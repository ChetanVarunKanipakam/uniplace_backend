import Job from "../models/Job.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
export const postJob = async (req, res) => {
  try {
    // req.body should include: { role, ..., rounds: [{name: "Aptitude", roundNumber: 1, ...}] }
    const job = await Job.create(req.body);

    // Notify students
    const students = await User.find({ role: 'student' });
    if (students.length > 0) {
        const notifications = students.map(student => ({
        recipient: student._id,
        title: 'New Job Posted',
        message: `New Opportunity: ${job.role} at ${req.body.companyName || 'a company'}.`,
        type: 'new_job',
        jobId: job._id
        }));
        await Notification.insertMany(notifications);
    }

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
