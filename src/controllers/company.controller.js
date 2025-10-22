import Company from "../models/Company.js";

export const getCompanies = async (req, res) => {
  const companies = await Company.find();
//   console.log(companies);
  res.json(companies);
};

import Notification from '../models/Notification.js'; // Adjust path
import User from '../models/User.js'; // Adjust path // Adjust path

export const addCompany = async (req, res) => {
  try {
    const company = await Company.create(req.body);

    const admins = await User.find({ role: 'admin' });
    const notifications = admins.map(admin => ({
      recipient: admin._id,
      title: 'New Company Added',
      message: `A new company, ${company.name}, has been added.`,
      type: 'new_company',
    }));
    await Notification.insertMany(notifications);

    res.status(201).json({ message: "Company added successfully", company });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
export const deleteCompany = async (req, res) => {
  await Company.findByIdAndDelete(req.params.id);
  res.json({ message: "Company deleted" });
};
