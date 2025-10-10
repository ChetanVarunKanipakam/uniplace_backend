import Company from "../models/Company.js";

export const getCompanies = async (req, res) => {
  const companies = await Company.find();
//   console.log(companies);
  res.json(companies);
};

export const addCompany = async (req, res) => {
  const company = await Company.create(req.body);
//   console.log(req.body);
  res.status(201).json({ message: "Company added successfully", company });
};

export const deleteCompany = async (req, res) => {
  await Company.findByIdAndDelete(req.params.id);
  res.json({ message: "Company deleted" });
};
