const mongoose = require("mongoose");

const businessUnitSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  companyLegalName: { type: String },
  companyAddress: { type: String },
  contactPhone: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("BusinessUnit", businessUnitSchema);