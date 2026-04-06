import User from "../models/User.js";
import Company from "../models/Company.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

export const getAdminAnalytics = async (req, res) => {
  try {
    // 1. Basic Counts
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalCompanies = await Company.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();

    // 2. Total Placed Students (Unique students who have status = 'selected')
    const placedStudentsList = await Application.distinct("studentId", { status: "selected" });
    const totalPlaced = placedStudentsList.length;

    // 3. Branch-wise Placements (Aggregation)
    const branchWisePlacements = await Application.aggregate([
      { $match: { status: "selected" } }, // Only look at selected applications
      { 
        $lookup: { 
          from: "users", 
          localField: "studentId", 
          foreignField: "_id", 
          as: "student" 
        } 
      },
      { $unwind: "$student" },
      { 
        $group: { 
          _id: "$student.branch", 
          placedCount: { $sum: 1 } 
        } 
      },
      { $sort: { placedCount: -1 } } // Sort highest first
    ]);

    // 4. Format branch stats nicely
    const formattedBranchStats = branchWisePlacements.map(b => ({
      branch: b._id || "Unknown",
      count: b.placedCount
    }));

    res.status(200).json({
      totalStudents,
      totalPlaced,
      placementRate: totalStudents > 0 ? ((totalPlaced / totalStudents) * 100).toFixed(1) : 0,
      totalCompanies,
      totalJobs,
      totalApplications,
      branchStats: formattedBranchStats
    });

  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};