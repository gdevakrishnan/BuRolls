const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { secret, expiresIn } = require("../config/jwt");

exports.registerSuperAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword, role: "SUPER_ADMIN", status: "APPROVED" });
    await user.save();

    res.status(201).json({ msg: "Super Admin registered successfully" });
  } catch (err) {
    res.status(500).send("Server error");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    if (user.status !== "APPROVED") {
      return res.status(403).json({ msg: "User not approved yet" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
    };

    const token = jwt.sign(
      { user: userData },
      secret,
      { expiresIn }
    );

    res.status(200).json({
      msg: "Login successfull",
      token,
      user: userData,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Return user info from the token payload (no DB lookup)
exports.me = async (req, res) => {
  try {
    // auth middleware normalizes token payload onto req.user
    res.status(200).json({ user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Forgot password - generate temp password and email it
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    user.password = hashedPassword;
    await user.save();

    await sendEmail(
      user.email,
      "BuRolls - Password Reset",
      `Hello ${user.name},\n\nA temporary password has been generated for your account.\n\nTemporary Password: ${tempPassword}\n\nPlease login and change your password.`
    );

    res.status(200).json({ msg: "Temporary password sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Change password - authenticated user provides old and new password
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || req.user;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ msg: "oldPassword and newPassword are required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Old password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ msg: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

