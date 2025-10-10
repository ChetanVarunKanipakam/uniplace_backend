import Result from "../models/Result.js";
import User from "../models/User.js";

export const publishResults = async (req, res) => {
  try {
    console.log(req.user);
    if (req.user?.role !== "admin") return res.status(403).json({ message: "Forbidden" });
    console.log(req.body);
    const { companyId, selectedStudents } = req.body;
    if (!companyId || !Array.isArray(selectedStudents)) {
      return res.status(400).json({ message: "companyId and selectedStudents array required" });
    }
    const result = await Result.findOneAndUpdate(
      { companyId },
      { selectedStudents },
      { upsert: true, new: true }
    );
    console.log(result)
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
      .populate("selectedStudents", "_id name email branch cgpa");

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

      return {
        jobId: job?._id,
        jobRole: job?.role || "Unknown Role",
        companyId: company?._id,
        companyName: company?.name || "Unknown Company",
        isSelected,
      };
    });
    console.log(userResults)
    return res.status(200).json({ results: userResults });
  } catch (err) {
    console.error("Error in getResults:", err);
    res.status(500).json({ message: err.message });
  }
};