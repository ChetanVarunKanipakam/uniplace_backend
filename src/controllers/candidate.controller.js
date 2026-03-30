import Application from "../models/Application.js";

export const fetchCandidates = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Fetch applications for this specific Job
    const apps = await Application.find({ jobId })
      .populate("studentId", "name email branch cgpa resumeUrl"); // Populate user details

    // Format list for Flutter "CandidateProvider"
    // We MUST return 'currentRound' for the tabs to work
    const candidates = apps.map(app => {
      // Handle case where student might be deleted but app exists
      if (!app.studentId) return null; 

      return {
        _id: app._id,
        // We return the populated student object as 'studentId' or 'student'
        // dependent on what your Flutter model expects.
        // Based on your previous Flutter code: c['studentId']['name']
        studentId: app.studentId, 
        status: app.status,           // 'applied', 'qualified', 'selected', 'rejected'
        currentRound: app.currentRound, // ✅ CRITICAL: Used to filter by Tab
        resumeUrl: app.resumeUrl,
        updatedAt: app.updatedAt
      };
    }).filter(c => c !== null); // Remove nulls

    res.json(candidates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};