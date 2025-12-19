const BusinessUnit = require("../models/BusinessUnit");
const User = require("../models/User");
const Company = require("../models/Company");

// Return complete overview for super admin: business units with managers, companies and users
exports.getOverview = async (req, res) => {
  try {
    const bus = await BusinessUnit.find().lean();

    const results = await Promise.all(
      bus.map(async (b) => {
        const managers = await User.find({ role: "BU_MANAGER", businessUnits: b._id }).select("-password -__v");
        const companies = await Company.find({ businessUnit: b._id }).lean();
        const companiesWithUsers = await Promise.all(
          companies.map(async (c) => {
            const users = await User.find({ company: c._id }).select("-password -__v");
            return { ...c, users };
          })
        );
        return { ...b, managers, companies: companiesWithUsers };
      })
    );

    res.status(200).json({ data: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Return simple aggregated stats for the admin dashboard
exports.getStats = async (req, res) => {
  try {
    const totalBusinessUnits = await BusinessUnit.countDocuments();
    const totalManagers = await User.countDocuments({ role: "BU_MANAGER" });
    const totalCompanies = await Company.countDocuments();
    const totalUsers = await User.countDocuments({ role: "BU_USER" });

    res.status(200).json({
      businessUnits: totalBusinessUnits,
      managers: totalManagers,
      companies: totalCompanies,
      users: totalUsers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get paginated list of managers (for admin list views)
exports.getManagers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 100;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const managers = await User.find({ role: "BU_MANAGER" })
      .select("-password -__v")
      .populate("businessUnits", "name")
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    const total = await User.countDocuments({ role: "BU_MANAGER" });
    res.status(200).json({ managers, total, page, limit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get paginated list of users (for admin list views). Each user will include company (and its BU) and managers for that BU
exports.getUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 100;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const users = await User.find({ role: "BU_USER" })
      .select("-password -__v")
      .populate({
        path: "company",
        select: "name businessUnit",
        populate: { path: "businessUnit", select: "name" },
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const results = await Promise.all(
      users.map(async (u) => {
        let bu = u.company?.businessUnit;
        let managers = [];
        if (bu) {
          managers = await User.find({ role: "BU_MANAGER", businessUnits: bu }).select("name _id").lean();
        }
        return { ...u, managers };
      })
    );

    const total = await User.countDocuments({ role: "BU_USER" });
    res.status(200).json({ users: results, total, page, limit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};