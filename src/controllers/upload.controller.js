import { cloudinary } from "../app.js";
import fs from "fs";
import User from "../models/User.js";
// Configure Cloudinary immediately after dotenv

// Controller function
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    // console.log(req);
    console.log("File received:", req.file);

    // Normalize path for Windows
    // const normalizedPath = req.file.path.replace(/\\/g, "/");

    // Upload to Cloudinaryq
    // const result = await cloudinary.uploader.upload(normalizedPath, {
    //   resource_type: "raw",
    //   folder: "resumes",
    //   access_mode: "public", 
    //   format: "pdf" 

    // });
    // console.log("Cloudinary upload result:", result);
    // const url = cloudinary.url(`${result.public_id}`,{ transformation : [{page: 1}]})
    // // Remove local file
    // fs.unlinkSync(req.file.path);
    // console.log(url)
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, // user ID from auth middleware
      { resumeUrl: `/uploads/${req.file.filename}` },
      { new: true } // return the updated user
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Resume uploaded successfully", resumeUrl: `http://10.56.238.182:5000/uploads/${req.file.filename}`,user: updatedUser });
  } catch (err) {
    console.error("Cloudinary error:", err);
    res.status(500).json({ message: err.message });
  }
};