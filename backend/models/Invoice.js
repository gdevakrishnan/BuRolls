const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  customerName: String,
  billingAddress: String,
  billingDate: Date,
  paymentCode: String,
  amount: Number,
});

const perCompanySchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  status: { type: String, enum: ['PENDING', 'ACCEPTED', 'PAID', 'REJECTED'], default: 'PENDING' },
  acceptedAt: Date,
  paidAt: Date,
  paymentInfo: Object,
});

const actionSchema = new mongoose.Schema({
  actorRole: String,
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: String,
  note: String,
  createdAt: { type: Date, default: Date.now },
});

const invoiceSchema = new mongoose.Schema({
  number: { type: Number, unique: true },
  type: { type: String, enum: ['NORMAL', 'CARRY'], required: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  superAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  businessUnit: { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessUnit' },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  items: [itemSchema],
  totalCustomers: Number,
  totalAmount: Number,
  applicableCompanies: [{ company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }, name: String }],
  perCompanyStatus: [perCompanySchema],
  status: { type: String, enum: ['PENDING_ADMIN_APPROVAL','PENDING_COMPANY_APPROVAL','PARTIALLY_ACCEPTED','ACCEPTED','PARTIALLY_PAID','PAID','REJECTED'], default: 'PENDING_ADMIN_APPROVAL' },
  actionHistory: [actionSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

invoiceSchema.pre('save', function(){
  // update timestamp synchronously; avoid calling next() to be compatible with Mongoose middleware
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Invoice', invoiceSchema);
