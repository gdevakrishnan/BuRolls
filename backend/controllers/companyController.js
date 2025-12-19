const Company = require("../models/Company");
const User = require("../models/User");
const sendEmail = require("../utils/email");

// BU User requests to create a company
exports.requestCompany = async (req, res) => {
  const { name } = req.body;
  try {
    const company = new Company({ name, createdBy: req.user.id, status: "PENDING" });
    await company.save();

    // Notify all approved BU Managers
    const managers = await User.find({ role: "BU_MANAGER", status: "APPROVED" });
    const managerEmails = managers.map((m) => m.email).join(",");

    if (managerEmails) {
      await sendEmail(
        managerEmails,
        `New Company Approval Request: ${company.name}`,
        `Company ${company.name} was requested by user ${req.user.id}. Approve at: ${process.env.APP_BASE_URL || "http://localhost:5000"}/api/companies/approve/${company._id}`
      );
    }

    res.status(201).json({ msg: "Company request sent to managers" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Manager approves company
exports.approveCompany = async (req, res) => {
  const { companyId } = req.params;
  try {
    const company = await Company.findById(companyId).populate("createdBy");
    if (!company) return res.status(404).json({ msg: "Company not found" });

    company.status = "APPROVED";
    await company.save();

    // Notify creator
    if (company.createdBy && company.createdBy.email) {
      await sendEmail(
        company.createdBy.email,
        `Your Company "${company.name}" is Approved`,
        `Hello ${company.createdBy.name || "User"},\n\nYour company "${company.name}" has been approved by a BU Manager. You can now manage company settings and invite users.`
      );
    }

    res.json({ msg: "Company approved" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// BU_MANAGER creates company directly (approved)
exports.managerCreateCompany = async (req, res) => {
  try {
    const managerId = req.user.id || req.user._id || req.user;
    const { name, businessUnit, legalName, legalAddress, address, contactPhone } = req.body;
    if (!name || !businessUnit) return res.status(400).json({ msg: "Name and businessUnit are required" });

    // Verify manager is assigned to the businessUnit
    const manager = await User.findById(managerId);
    if (!manager) return res.status(404).json({ msg: "Manager not found" });
    if (!manager.businessUnits || !manager.businessUnits.map(String).includes(String(businessUnit))) {
      return res.status(403).json({ msg: "Manager not assigned to this business unit" });
    }

    const company = new Company({ name, legalName, legalAddress, address, contactPhone, createdBy: managerId, businessUnit, status: "APPROVED" });
    await company.save();

    res.status(201).json({ company });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// BU_MANAGER - get companies they created
exports.getCompaniesForManager = async (req, res) => {
  try {
    const managerId = req.user.id || req.user._id || req.user;
    const companies = await Company.find({ createdBy: managerId }).select("-__v");
    res.status(200).json({ companies });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// BU_MANAGER - get users for a specific company (must own company)
exports.getCompanyUsers = async (req, res) => {
  try {
    const managerId = req.user.id || req.user._id || req.user;
    const { companyId } = req.params;
    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ msg: "Company not found" });
    if (String(company.createdBy) !== String(managerId)) return res.status(403).json({ msg: "Not authorized" });

    const users = await User.find({ company: companyId }).select("-password -__v");
    res.status(200).json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
