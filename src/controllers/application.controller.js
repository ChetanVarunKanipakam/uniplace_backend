import Application from "../models/Application.js";
import User from "../models/User.js";
import Company from "../models/Company.js";


export const applyToCompany = async (req, res) => {
  try {
    const studentId = req.user?.id;
    const { companyId, jobId, resumeUrl } = req.body;

    const existing = await Application.findOne({ studentId, jobId });
    if (existing) return res.status(400).json({ message: "Already applied" });

    // Create application starting at Round 1
    const app = await Application.create({ 
        studentId, 
        companyId, 
        jobId, 
        resumeUrl,
        currentRound: 1, 
        status: "applied" 
    });

    res.status(201).json({ message: "Applied successfully", application: app });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Add this to your controllers/application.controller.js

// Fetch applications for the currently logged-in student
export const getStudentApplications = async (req, res) => {
  try {
    const studentId = req.user.id; // Comes from authMiddleware
    
    const apps = await Application.find({ studentId })
      .populate({
        path: 'jobId',
        select: 'role companyId rounds deadline',
        populate: { path: 'companyId', select: 'name photoUrl' }
      })
      .sort({ createdAt: -1 });

    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
