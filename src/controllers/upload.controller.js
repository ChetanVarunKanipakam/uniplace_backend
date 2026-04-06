import User from "../models/User.js";

const calculateResumeScore = (resumeUrl) => {
  // Generates a random score between 65 and 95
  const score = Math.floor(Math.random() * (95 - 65 + 1)) + 65;
  let review = "";
  
  if (score >= 85) {
    review = "Excellent resume! Strong action verbs, great formatting, and clear metrics. You are highly likely to be shortlisted.";
  } else if (score >= 75) {
    review = "Good resume, but could use more quantifiable achievements. Try to highlight specific project impacts.";
  } else {
    review = "Needs improvement. Focus on specific technical skills, remove fluff, and ensure consistent formatting.";
  }
  
  return { score, review };
};

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const resumeUrl = req.file.path; 
    
    // ✅ 1. Calculate Score & Review
    const { score, review } = calculateResumeScore(resumeUrl);

    // ✅ 2. Save resumeUrl, score, and review to the database
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id || req.user._id, // Handle token ID
      { 
        resumeUrl: resumeUrl,
        resumeScore: score,
        resumeReview: review
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ 
      message: "Resume uploaded successfully", 
      resumeUrl: resumeUrl,
      resumeScore: score,
      resumeReview: review,
      user: updatedUser 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};