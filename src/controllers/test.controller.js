import Test from "../models/Test.js";

export const createTest = async (req, res) => {
  try {
    if (req.user?.role !== "admin") return res.status(403).json({ message: "Forbidden" });

    const test = await Test.create(req.body);
    res.status(201).json({ message: "Test created", test });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// returns test payload WITHOUT answers for non-admins
export const getTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ message: "Test not found" });

    const userRole = req.user?.role;
    if (userRole === "admin" || userRole === "recruiter") {
      return res.json(test);
    }

    // hide answers for students
    const sanitized = {
      _id: test._id,
      companyId: test.companyId,
      questions: test.questions.map((q) => ({
        q: q.q,
        options: q.options,
      })),
      createdAt: test.createdAt,
      updatedAt: test.updatedAt,
    };

    res.json(sanitized);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const submitTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ message: "Test not found" });

    const { studentId, answers } = req.body;
    if (!Array.isArray(answers)) return res.status(400).json({ message: "Answers array required" });

    let score = 0;
    for (let i = 0; i < test.questions.length; i++) {
      const correct = test.questions[i].answer;
      if (answers[i] !== undefined && answers[i] === correct) score++;
    }

    // Optionally: you can store student test submissions in DB (left as future enhancement)
    res.json({ message: "Test submitted", score, total: test.questions.length });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
