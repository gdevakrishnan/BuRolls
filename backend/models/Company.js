const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  legalName: { type: String },
  legalAddress: { type: String },
  address: { type: String },
  contactPhone: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  businessUnit: { type: mongoose.Schema.Types.ObjectId, ref: "BusinessUnit" },
  status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Company", companySchema);
