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
