import Application from "../models/Application.js";
import User from "../models/User.js";
import Company from "../models/Company.js";


export const applyToCompany = async (req, res) => {
  try {
    const studentId = req.user?.id; // from JWT
    const { companyId, jobId, resumeUrl } = req.body;
    if (!studentId) return res.status(401).json({ message: "Unauthorized" });

    // Prevent duplicate application
    const existing = await Application.findOne({ studentId, companyId, jobId });
    if (existing) return res.status(400).json({ message: "Already applied" });

    const app = await Application.create({ studentId, companyId, jobId, resumeUrl });
    res.status(201).json({ message: "Applied successfully", application: app });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// recruiter/admin can fetch applications for a company
export const getApplicationsByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const apps = await Application.find({ companyId }).populate("studentId", "name email branch cgpa resumeUrl");
    res.json(apps);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// optional: update application status (shortlist/select)
export const updateApplicationStatus = async (req, res) => {
  try {
    if (req.user?.role !== "admin" && req.user?.role !== "recruiter") return res.status(403).json({ message: "Forbidden" });

    const { id } = req.params;
    const { status } = req.body;
    const allowed = ["applied", "shortlisted", "selected", "rejected"];
    if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });

    const app = await Application.findByIdAndUpdate(id, { status }, { new: true });
    res.json({ message: "Status updated", application: app });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
