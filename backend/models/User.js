const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  businessUnits: [{ type: mongoose.Schema.Types.ObjectId, ref: "BusinessUnit" }],
  // Per-business-unit field-level permissions for managers
  businessUnitPermissions: [
    {
      businessUnit: { type: mongoose.Schema.Types.ObjectId, ref: "BusinessUnit" },
      fields: [{ type: String }],
    },
  ],
  role: { type: String, enum: ["SUPER_ADMIN", "BU_MANAGER", "BU_USER"], required: true },
  status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
