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
