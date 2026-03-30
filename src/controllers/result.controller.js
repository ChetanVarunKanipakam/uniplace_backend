import Result from "../models/Result.js";
import User from "../models/User.js";

import Notification from '../models/Notification.js'; // Adjust path
// Adjust path
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import Notification from "../models/Notification.js";

export const promoteStudents = async (req, res) => {
  try {
    const { jobId, roundNumber, qualifiedStudentIds } = req.body;
    
    // 1. Get the Job to know how many rounds exist
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const totalRounds = job.rounds.length;
    const isFinalRound = roundNumber === totalRounds;

    // 2. Update QUALIFIED Students
    // If it's the final round, status becomes "selected". 
    // If not, increment currentRound and keep status "qualified" (or "applied" depending on your preference)
    
    const newStatus = isFinalRound ? "selected" : "qualified";
    const nextRoundNum = isFinalRound ? roundNumber : roundNumber + 1;

    await Application.updateMany(
      { jobId: jobId, studentId: { $in: qualifiedStudentIds } },
      { 
        $set: { 
            status: newStatus,
            currentRound: nextRoundNum 
        },
        $push: { roundHistory: { roundNumber: roundNumber, status: "cleared" } }
      }
    );

    // 3. Update REJECTED Students (Everyone in this round who was NOT in the qualified list)
    await Application.updateMany(
      { 
        jobId: jobId, 
        currentRound: roundNumber, 
        studentId: { $nin: qualifiedStudentIds } 
      },
      { 
        $set: { status: "rejected" },
        $push: { roundHistory: { roundNumber: roundNumber, status: "failed" } }
      }
    );

    // 4. Send Notifications to Qualified Students
    const notifs = qualifiedStudentIds.map(id => ({
        recipient: id,
        title: isFinalRound ? "Congratulations! Job Offer" : "Round Cleared!",
        message: isFinalRound 
            ? `You have been selected for ${job.role}!` 
            : `You have cleared Round ${roundNumber}. Get ready for the next round.`,
        type: 'shortlist',
        jobId: jobId
    }));
    
    if(notifs.length > 0) await Notification.insertMany(notifs);

    res.json({ message: "Results published. Students promoted/rejected successfully." });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const publishResults = async (req, res) => {
  try {
    // if (req.user?.role !== "admin") {
    //   return res.status(403).json({ message: "Forbidden" });
    // }
    const { companyId, selectedStudents } = req.body;
    if (!companyId || !Array.isArray(selectedStudents)) {
      return res.status(400).json({ message: "companyId and selectedStudents array required" });
    }
    const result = await Result.findOneAndUpdate(
      { companyId }, // Assuming this is the Job ID
      { selectedStudents },
      { upsert: true, new: true }
    );

    const notifications = selectedStudents.map(studentId => ({
      recipient: studentId,
      title: 'Congratulations! You are Shortlisted',
      message: `You have been shortlisted for the next round.`,
      type: 'shortlist',
    }));
    await Notification.insertMany(notifications);

    res.json({ message: "Results published", result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getResults = async (req, res) => {
  try {
    const { companyId } = req.params;
    const result = await Result.findOne({ companyId }).populate("selectedStudents", "name email branch cgpa");
    console.log(req.params);
    if (!result) return res.json({ companyId, selectedStudents: [] });
    console.log(result)
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

import Job from "../models/Job.js";
import Company from "../models/Company.js";

export const getResults1 = async (req, res) => {

  try {
    const userId = req.user.id; // ✅ Taken from auth middleware

    // ✅ Fetch all results with job (companyId) and its company populated
    const results = await Result.find({})
      .populate({
        path: "companyId", // refers to Job
        select: "role companyId",
        populate: {
          path: "companyId", // refers to Company inside Job
          select: "name",
        },
      })
      .populate("selectedStudents", "_id name email branch cgpa").sort({ createdAt: -1 });

    if (!results || results.length === 0) {
      return res.status(200).json({ results: [] });
    }

    // ✅ Prepare user-specific summary
    const userResults = results.map((result) => {
      const job = result.companyId; // job document
      const company = job?.companyId; // company document inside job

      const isSelected = result.selectedStudents.some(
        (student) => student._id.toString() === userId.toString()
      );
      if(company?.name){
      return {
        jobId: job?._id,
        jobRole: job?.role || "Unknown Role",
        companyId: company?._id,
        companyName: company?.name || "Unknown Company",
        isSelected,
      };}
      return null;
    });
    const filteredResults = userResults.filter((r) => r !== null);

    return res.status(200).json({ results: filteredResults });
  } catch (err) {
    console.error("Error in getResults:", err);
    res.status(500).json({ message: err.message });
  }
};