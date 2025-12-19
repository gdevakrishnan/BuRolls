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
  console.log(email, password);
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });
    if (user.status !== "APPROVED") return res.status(403).json({ msg: "User not approved yet" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn });
    res.json({ token });
  } catch (err) {
    res.status(500).send("Server error");
  }
};
