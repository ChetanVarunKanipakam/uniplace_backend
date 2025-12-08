import { cloudinary } from "../app.js";
import fs from "fs";
import User from "../models/User.js";
// Configure Cloudinary immediately after dotenv
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // req.file.path contains the Cloudinary URL
    const resumeUrl = req.file.path; 
    
    // Save resumeUrl to your database associated with the user...
     const updatedUser = await User.findByIdAndUpdate(
      req.user._id, // user ID from auth middleware
      { resumeUrl: resumeUrl },
      { new: true } // return the updated user
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Resume uploaded successfully", resumeUrl: resumeUrl,user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Controller function
