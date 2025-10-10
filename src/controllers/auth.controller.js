import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const hashed = await bcrypt.hash(password, 10);
    let user=null;
    if(role=="student"){
      const{cgpa,branch}=req.body;
      user = await User.create({ name, email, password: hashed, role, cgpa, branch });
    }else if(role=="recruiter"){
      const {company}=req.body;
      user = await User.create({ name, email, password: hashed, role, company });
    }else{
      user = await User.create({ name, email, password: hashed, role });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });
    // console.log(req.body);
    res.status(201).json({
      message: "User registered successfully",
      token,
      user
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    const user = await User.findOne({ email });
    console.log(user)
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });
    console.log(token)
    res.json({ message: "Login successful", token, user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
