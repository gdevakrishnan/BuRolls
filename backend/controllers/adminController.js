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