import Application from "../models/Application.js";
import User from "../models/User.js";
import Company from "../models/Company.js";
import Job from "../models/Job.js";
import MatchScore from "../models/MatchScore.js";
import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import { createRequire } from "module";

// 🔥 FIX: Properly load pdf-parse in ESM
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/* =======================================================
   APPLY TO COMPANY
======================================================= */
export const applyToCompany = async (req, res) => {
  try {
    const studentId = req.user?.id;
    const { companyId, jobId, resumeUrl } = req.body;

    const existing = await Application.findOne({ studentId, jobId });
    if (existing) {
      return res.status(400).json({ message: "Already applied" });
    }

    const app = await Application.create({
      studentId,
      companyId,
      jobId,
      resumeUrl,
      currentRound: 1,
      status: "applied",
    });

    res.status(201).json({
      message: "Applied successfully",
      application: app,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* =======================================================
   GET MATCH SCORE
======================================================= */
export const getMatchScore = async (req, res) => {
  try {
    const match = await MatchScore.findOne({
      studentId: req.user.id,
      jobId: req.params.jobId,
    });

    if (!match) {
      return res.status(200).json({ matchPercentage: null });
    }

    res.json({ matchPercentage: match.matchPercentage });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =======================================================
   CALCULATE MATCH SCORE (FIXED)
======================================================= */
export const calculateMatchScore = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { jobId } = req.params;

    // 🔹 1. Validate User
    const user = await User.findById(studentId);
    if (!user || !user.resumeUrl) {
      return res.status(400).json({
        message: "Please upload your resume first.",
      });
    }

    // 🔹 2. Validate Job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    let score = 0;

    try {
      /* ==========================================
         3. DOWNLOAD RESUME
      ========================================== */
      console.log("Fetching Resume:", user.resumeUrl);

      const pdfResp = await axios.get(user.resumeUrl, {
        responseType: "arraybuffer",
      });

      const dataBuffer = Buffer.from(pdfResp.data);

      /* ==========================================
         4. PARSE PDF (FIXED)
      ========================================== */
      const pdfData = await pdfParse(dataBuffer);

      const resumeText = pdfData.text?.substring(0, 5000) || "";

      if (!resumeText || resumeText.length < 20) {
        return res.status(400).json({
          message: "Resume content is too small or unreadable.",
        });
      }

      /* ==========================================
         5. BUILD PROMPT
      ========================================== */
      const prompt = `
          Analyze the following resume and compare it to the job description.
          Return ONLY valid JSON. No explanation.

          FORMAT:
          { "matchPercentage": number }

          Job Role: ${job.role}
          Skills: ${job.skillsRequired?.join(", ") || "N/A"}

          Resume:
          """${resumeText}"""
          `;

      /* ==========================================
         6. CALL GEMINI
      ========================================== */
      const aiResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [prompt],
      });

      const rawText =
        typeof aiResponse.text === "function"
          ? aiResponse.text()
          : aiResponse.text;

      console.log("RAW AI RESPONSE:", rawText);

      /* ==========================================
         7. PARSE AI RESPONSE
      ========================================== */
      let result;

      try {
        const cleanJson = rawText.replace(/```json|```/g, "").trim();
        result = JSON.parse(cleanJson);
      } catch (e) {
        console.error("JSON parse failed. Raw:", rawText);

        // fallback: extract number
        const match = rawText.match(/\d+/);
        result = {
          matchPercentage: match ? parseInt(match[0]) : 50,
        };
      }

      if (typeof result.matchPercentage !== "number") {
        throw new Error("Invalid AI response format");
      }

      score = result.matchPercentage;
    } catch (aiError) {
      console.error("AI/PDF ERROR:", aiError);

      return res.status(500).json({
        message: "AI matching failed. Try again later.",
        error: aiError.message,
      });
    }

    /* ==========================================
       8. SAVE SCORE
    ========================================== */
    const match = await MatchScore.findOneAndUpdate(
      { studentId, jobId },
      { matchPercentage: score },
      { upsert: true, new: true }
    );

    return res.json({
      matchPercentage: match.matchPercentage,
      message: "Match calculated successfully!",
    });
  } catch (err) {
    console.error("SERVER ERROR:", err);

    return res.status(500).json({
      message: err.message || "Server error",
    });
  }
};

/* =======================================================
   GET STUDENT APPLICATIONS
======================================================= */
export const getStudentApplications = async (req, res) => {
  try {
    const studentId = req.user.id;

    const apps = await Application.find({ studentId })
      .populate({
        path: "jobId",
        select: "role companyId rounds deadline",
        populate: {
          path: "companyId",
          select: "name photoUrl",
        },
      })
      .sort({ createdAt: -1 });

    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =======================================================
   GET APPLICATIONS BY COMPANY
======================================================= */
export const getApplicationsByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;

    const apps = await Application.find({ companyId }).populate(
      "studentId",
      "name email branch cgpa resumeUrl"
    );

    res.json(apps);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* =======================================================
   UPDATE APPLICATION STATUS
======================================================= */
export const updateApplicationStatus = async (req, res) => {
  try {
    if (req.user?.role !== "admin" && req.user?.role !== "recruiter") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["applied", "shortlisted", "selected", "rejected"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const app = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.json({
      message: "Status updated",
      application: app,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};