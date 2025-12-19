const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Company = require("../models/Company");
const sendEmail = require("../utils/email");

// BU Manager/User requests registration
exports.requestUser = async (req, res) => {
  const { name, email, role } = req.body; // role: BU_MANAGER or BU_USER
  try {
    let existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "User already exists" });

    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const user = new User({ name, email, password: hashedPassword, tempPassword, role, status: "PENDING" });
    await user.save();

    // Notify superadmin with user details and link to approve
    await sendEmail(
      process.env.SUPERADMIN_EMAIL,
      `New ${role} Registration Request`,
      `User ${name} (${email}) requested registration.\nApprove at: ${process.env.APP_BASE_URL || "http://localhost:5000"}/api/users/approve/${user._id}`
    );

    res.status(201).json({ msg: "Request sent to Super Admin" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Super Admin approves request
exports.approveUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.status = "APPROVED";
    await user.save();

    // Send email with credentials (including temp password if available)
    const tempPwdText = user.tempPassword ? `Password: ${user.tempPassword}` : "Password: (please reset via forgot password)";

    await sendEmail(
      user.email,
      "Your BuRolls Account is Approved",
      `Hello ${user.name},\n\nYour BuRolls account has been approved.\n\nEmail: ${user.email}\n${tempPwdText}\n\nPlease login and change your password.`
    );

    // Clear temp password from DB for security
    user.tempPassword = undefined;
    await user.save();

    res.json({ msg: "User approved and credentials sent" });
  } catch (err) {
    res.status(500).send("Server error");
  }
};

// Return the current user by reading token and fetching the latest data from DB
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || req.user;
    let user = await User.findById(userId).select("-password -tempPassword -__v").populate({ path: 'company', select: 'name businessUnit' });
    if (!user) return res.status(404).json({ msg: "User not found" });

    // If BU_USER, attach manager(s) responsible for the user's company BU
    if (user.role === 'BU_USER' && user.company && user.company.businessUnit) {
      const managers = await User.find({ role: 'BU_MANAGER', businessUnits: user.company.businessUnit }).select('name email');
      user = user.toObject();
      user.managers = managers;
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// SUPER_ADMIN — create a manager and map to business units
exports.createManager = async (req, res) => {
  try {
    const { name, email, businessUnits } = req.body; // businessUnits: array of IDs
    if (!name || !email) return res.status(400).json({ msg: "Name and email are required" });

    let existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "User already exists" });

    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const manager = new User({ name, email, password: hashedPassword, tempPassword, role: "BU_MANAGER", status: "APPROVED", businessUnits });
    await manager.save();

    // Send welcome email with credentials
    await sendEmail(
      manager.email,
      "Welcome to BuRolls - Manager Account Created",
      `Hello ${manager.name},\n\nA manager account has been created for you.\n\nEmail: ${manager.email}\nPassword: ${tempPassword}\n\nPlease login and change your password.`
    );

    // Clear temp password for security
    manager.tempPassword = undefined;
    await manager.save();

    const toReturn = await User.findById(manager._id).select("-password -__v");
    res.status(201).json({ manager: toReturn });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// BU_MANAGER — create a user and map to a company
exports.managerCreateUser = async (req, res) => {
  try {
    const managerId = req.user.id || req.user._id || req.user;
    // companyId can be provided either in params (route) or body
    const companyId = req.params.companyId || req.body.companyId;
    const { name, email } = req.body;
    if (!name || !email || !companyId) return res.status(400).json({ msg: "Name, email and companyId are required" });

    // ensure company belongs to this manager
    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ msg: "Company not found" });
    if (String(company.createdBy) !== String(managerId)) return res.status(403).json({ msg: "You are not authorized for this company" });

    let existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "User already exists" });

    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const user = new User({ name, email, password: hashedPassword, tempPassword, role: "BU_USER", status: "APPROVED", company: companyId });
    await user.save();

    // Send credentials
    await sendEmail(
      user.email,
      "Your BuRolls Account - Company User",
      `Hello ${user.name},\n\nYour account has been created for company ${company.name}.\n\nEmail: ${user.email}\nPassword: ${tempPassword}\n\nPlease login and change your password.`
    );

    // Clear temp password for security
    user.tempPassword = undefined;
    await user.save();

    const toReturn = await User.findById(user._id).select("-password -__v");
    res.status(201).json({ user: toReturn });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
