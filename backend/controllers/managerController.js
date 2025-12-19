const User = require("../models/User");
const BusinessUnit = require("../models/BusinessUnit");
const Company = require("../models/Company");

// Get business units assigned to the logged-in manager
// Returns businessUnits with 'allowedFields' (fields the manager can edit for that BU)
exports.getAssignedBusinessUnits = async (req, res) => {
  try {
    const managerId = req.user?.id || req.user?._id || req.user;
    const manager = await User.findById(managerId).populate("businessUnits", "name companyLegalName companyAddress contactPhone");
    if (!manager) return res.status(404).json({ msg: "Manager not found" });

    const perms = manager.businessUnitPermissions || [];
    const results = (manager.businessUnits || []).map((bu) => {
      const p = perms.find((pp) => String(pp.businessUnit) === String(bu._id));
      return { ...bu.toObject(), allowedFields: p ? p.fields : [] };
    });

    res.status(200).json({ businessUnits: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get stats for the manager (companies count and users count)
exports.getStats = async (req, res) => {
  try {
    const managerId = req.user?.id || req.user?._id || req.user;
    const companies = await Company.find({ createdBy: managerId }).select("_id");
    const companyIds = companies.map((c) => c._id);
    const companiesCount = companies.length;
    const usersCount = await User.countDocuments({ company: { $in: companyIds } });

    res.status(200).json({ companies: companiesCount, users: usersCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get all users under this manager across their companies
exports.getUsers = async (req, res) => {
  try {
    const managerId = req.user?.id || req.user?._id || req.user;
    const companies = await Company.find({ createdBy: managerId }).select("_id name businessUnit");
    const companyIds = companies.map((c) => c._id);
    const users = await User.find({ company: { $in: companyIds } })
      .select("-password -__v")
      .populate({ path: "company", select: "name businessUnit", populate: { path: "businessUnit", select: "name" } })
      .lean();

    res.status(200).json({ users, companies });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};