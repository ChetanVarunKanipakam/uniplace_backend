// simple controller that returns candidates (students) for a company (wraps applications)
import Application from "../models/Application.js";

export const fetchCandidates = async (req, res) => {
  try {
    const { jobId } = req.params;
    const apps = await Application.find({ jobId }).populate("studentId", "name email branch cgpa resumeUrl");
    console.log(apps);
    // Format a simple candidate list
    const candidates = apps.map(a => ({
      applicationId: a._id,
      student: a.studentId,
      status: a.status,
      resumeUrl: a.resumeUrl
    }));
    console.log("candidates",candidates);
    res.json(candidates);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
