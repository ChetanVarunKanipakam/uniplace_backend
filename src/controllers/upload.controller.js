import User from "../models/User.js";
import { GoogleGenAI, Type } from "@google/genai";
import axios from "axios";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const calculateResumeScore = async (resumeUrl) => {
  try {
    // 1. Download the PDF from Cloudinary as a buffer
    const response = await axios.get(resumeUrl, { responseType: 'arraybuffer' });
    const pdfBase64 = Buffer.from(response.data).toString('base64');

    // 2. Ask Gemini to analyze it
    const aiResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents:[
        "You are an expert HR ATS (Applicant Tracking System). Analyze this resume. Give it an ATS score out of 100 based on formatting, action verbs, and clarity. Also provide a short review (max 3 sentences).",
        {
          inlineData: {
            data: pdfBase64,
            mimeType: "application/pdf"
          }
        }
      ],
      config: {
        // Enforce strict JSON output
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            review: { type: Type.STRING }
          },
          required: ["score", "review"]
        }
      }
    });

    // 3. Parse and return the result
    const result = JSON.parse(aiResponse.text);
    return { score: result.score, review: result.review };

  } catch (error) {
    console.error("Gemini AI Error:", error);
    // Fallback in case of API failure
    return { score: 70, review: "Resume uploaded, but AI analysis is currently unavailable." };
  }
};

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const resumeUrl = req.file.path; 
    
    // ✅ 1. Wait for AI to Calculate Score & Review
    const { score, review } = await calculateResumeScore(resumeUrl);

    // ✅ 2. Save resumeUrl, score, and review to the database
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id || req.user._id,
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