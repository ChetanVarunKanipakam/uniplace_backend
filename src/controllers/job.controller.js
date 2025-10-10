import Job from "../models/Job.js";

export const postJob = async (req, res) => {
  try {
    // recruiter or admin
    if (!["recruiter", "admin"].includes(req.user?.role)) return res.status(403).json({ message: "Forbidden" });
    console.log(req.body);
    const job = await Job.create(req.body);
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
