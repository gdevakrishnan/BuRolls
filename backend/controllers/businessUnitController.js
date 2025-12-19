const BusinessUnit = require("../models/BusinessUnit");
const User = require("../models/User");

const ALLOWED_FIELDS = ["name","companyLegalName","companyAddress","contactPhone"];

exports.createBusinessUnit = async (req, res) => {
  try {
    const { name, companyLegalName, companyAddress, contactPhone } = req.body;
    if (!name) return res.status(400).json({ msg: "Name is required" });

    const exists = await BusinessUnit.findOne({ name });
    if (exists) return res.status(400).json({ msg: "Business Unit already exists" });

    const bu = new BusinessUnit({ name, companyLegalName, companyAddress, contactPhone, createdBy: req.user.id });
    await bu.save();

    res.status(201).json({ bu });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getAllBusinessUnits = async (req, res) => {
  try {
    const bus = await BusinessUnit.find().populate("createdBy", "name email role");
    res.status(200).json({ businessUnits: bus });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Update a business unit
exports.updateBusinessUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {};
    ALLOWED_FIELDS.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    if (Object.keys(updates).length === 0) return res.status(400).json({ msg: "No updatable fields provided" });

    const bu = await BusinessUnit.findById(id);
    if (!bu) return res.status(404).json({ msg: "Business Unit not found" });

    // SUPER_ADMIN can update any fields
    if (req.user.role === "SUPER_ADMIN") {
      Object.assign(bu, updates);
      await bu.save();
      return res.status(200).json({ bu });
    }

    // BU_MANAGER can update only fields assigned to them
    if (req.user.role === "BU_MANAGER") {
      const manager = await User.findById(req.user.id);
      const perm = (manager.businessUnitPermissions || []).find((p) => String(p.businessUnit) === String(id));
      if (!perm) return res.status(403).json({ msg: "No permissions to edit this business unit" });

      const requestedFields = Object.keys(updates);
      const unauthorized = requestedFields.some((f) => !perm.fields.includes(f));
      if (unauthorized) return res.status(403).json({ msg: "Not authorized to edit these fields" });

      Object.assign(bu, updates);
      await bu.save();
      return res.status(200).json({ bu });
    }

    res.status(403).json({ msg: "Access denied" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Assign or update manager access for a business unit (SUPER_ADMIN only)
exports.assignManagerAccess = async (req, res) => {
  try {
    const { id } = req.params; // business unit id
    const { managerId, fields } = req.body;
    if (!managerId || !Array.isArray(fields)) return res.status(400).json({ msg: "managerId and fields[] required" });

    // validate fields
    const invalid = fields.some((f) => !ALLOWED_FIELDS.includes(f));
    if (invalid) return res.status(400).json({ msg: "One or more fields are invalid" });

    const manager = await User.findById(managerId);
    if (!manager) return res.status(404).json({ msg: "Manager not found" });
    if (manager.role !== "BU_MANAGER") return res.status(400).json({ msg: "User is not a manager" });

    // upsert permission entry
    const idx = (manager.businessUnitPermissions || []).findIndex((p) => String(p.businessUnit) === String(id));
    if (idx === -1) {
      manager.businessUnitPermissions = manager.businessUnitPermissions || [];
      manager.businessUnitPermissions.push({ businessUnit: id, fields });
    } else {
      manager.businessUnitPermissions[idx].fields = fields;
    }

    // ensure the manager.businessUnits contains this BU
    manager.businessUnits = manager.businessUnits || [];
    if (!manager.businessUnits.map(String).includes(String(id))) manager.businessUnits.push(id);

    await manager.save();

    res.status(200).json({ msg: "Manager access updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};