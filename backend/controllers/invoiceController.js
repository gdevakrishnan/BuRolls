const Invoice = require('../models/Invoice');
const Counter = require('../models/Counter');
const Company = require('../models/Company');
const User = require('../models/User');
const sendEmail = require('../utils/email');

async function nextInvoiceNumber(){
  const r = await Counter.findOneAndUpdate({ _id: 'invoice' }, { $inc: { seq: 1 } }, { new: true, upsert: true });
  return r.seq;
}

// Manager creates invoice
exports.createInvoice = async (req, res) => {
  try{
    const managerId = req.user?.id || req.user?._id || req.user;
    const { type, companyId, businessUnitId, items } = req.body;
    if (!type || !['NORMAL','CARRY'].includes(type)) return res.status(400).json({ msg: 'Invalid type' });
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ msg: 'Items required' });

    const number = await nextInvoiceNumber();
    const totalCustomers = items.length;
    const totalAmount = items.reduce((s,i)=> s + (Number(i.amount)||0), 0);

    const invoice = new Invoice({ number, type, manager: managerId, items, totalCustomers, totalAmount, status: 'PENDING_ADMIN_APPROVAL' });

    if (type === 'NORMAL'){
      if (!companyId) return res.status(400).json({ msg: 'companyId required for NORMAL invoice' });
      const company = await Company.findById(companyId);
      if (!company) return res.status(404).json({ msg: 'Company not found' });
      invoice.company = companyId;
      invoice.applicableCompanies = [{ company: company._id, name: company.name }];
      invoice.perCompanyStatus = [{ company: company._id, status: 'PENDING' }];
    } else {
      // carry invoice: apply to all companies under businessUnitId
      if (!businessUnitId) return res.status(400).json({ msg: 'businessUnitId required for CARRY invoice' });
      invoice.businessUnit = businessUnitId;
      const companies = await Company.find({ businessUnit: businessUnitId });
      invoice.applicableCompanies = companies.map(c=>({ company: c._id, name: c.name }));
      invoice.perCompanyStatus = companies.map(c=>({ company: c._id, status: 'PENDING' }));
    }

    invoice.actionHistory = [{ actorRole: 'BU_MANAGER', actorId: managerId, action: 'CREATED', note: 'Created by manager' }];

    await invoice.save();

    // notify super admin(s) - send to SUPERADMIN_EMAIL env if set
    try{
      const adminEmail = process.env.SUPERADMIN_EMAIL;
      if (adminEmail) await sendEmail(adminEmail, 'Invoice pending approval', `Invoice #${invoice.number} created and awaiting approval`);
    }catch(e){ console.error('Email failed', e); }

    res.status(201).json({ invoice });
  }catch(err){
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Manager list invoices
exports.getManagerInvoices = async (req, res) => {
  try{
    const managerId = req.user?.id || req.user?._id || req.user;
    const invoices = await Invoice.find({ manager: managerId }).sort({ createdAt: -1 }).lean();
    res.status(200).json({ invoices });
  }catch(err){ console.error(err); res.status(500).json({ msg: 'Server error' }); }
};

// Admin list
exports.getAllInvoices = async (req, res) => {
  try{
    const status = req.query.status;
    const q = status ? { status } : {};
    const invoices = await Invoice.find(q).sort({ createdAt: -1 }).populate('manager', 'name email').lean();
    res.status(200).json({ invoices });
  }catch(err){ console.error(err); res.status(500).json({ msg: 'Server error' }); }
};

exports.getInvoiceById = async (req, res) => {
  try{
    const invoice = await Invoice.findById(req.params.invoiceId).populate('manager','name email').lean();
    if(!invoice) return res.status(404).json({ msg: 'Invoice not found' });
    res.status(200).json({ invoice });
  }catch(err){ console.error(err); res.status(500).json({ msg: 'Server error' }); }
};

// Admin update (including approve)
exports.adminUpdate = async (req, res) => {
  try{
    const invoice = await Invoice.findById(req.params.invoiceId);
    if(!invoice) return res.status(404).json({ msg: 'Invoice not found' });

    const { action, updatedFields } = req.body; // action can be 'edit' or 'approve' or 'reject' or 'approve_and_send'

    if (action === 'edit'){
      // allow editing items, amounts etc before approval
      if (updatedFields?.items) invoice.items = updatedFields.items;
      if (updatedFields?.totalAmount) invoice.totalAmount = updatedFields.totalAmount;
      if (updatedFields?.totalCustomers) invoice.totalCustomers = updatedFields.totalCustomers;
    }

    if (action === 'approve'){
      invoice.status = 'PENDING_COMPANY_APPROVAL';
      invoice.superAdmin = req.user.id;
      invoice.actionHistory.push({ actorRole: 'SUPER_ADMIN', actorId: req.user.id, action: 'APPROVED', note: 'Approved by super admin' });
    }

    if (action === 'reject'){
      invoice.status = 'REJECTED';
      invoice.actionHistory.push({ actorRole: 'SUPER_ADMIN', actorId: req.user.id, action: 'REJECTED', note: req.body.note || 'Rejected' });
    }

    await invoice.save();

    // notify companies (for NORMAL one company; for CARRY all)
    try{
      const companyIds = invoice.applicableCompanies.map(c=>c.company);
      const users = await User.find({ company: { $in: companyIds }, role: 'BU_USER' }).select('email');
      const emails = users.map(u=>u.email).filter(Boolean).join(',');
      if (emails) await sendEmail(emails, `Invoice #${invoice.number} awaiting your response`, 'An invoice has been approved by admin and awaits your acceptance.');
    }catch(e){ console.error('email failed', e); }

    res.status(200).json({ invoice });
  }catch(err){ console.error(err); res.status(500).json({ msg: 'Server error' }); }
};

// Company: list invoices assigned to this company
exports.getCompanyInvoices = async (req, res) => {
  try{
    const companyId = req.params.companyId;
    // ensure user belongs to company
    const userId = req.user?.id || req.user?._id || req.user;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    if (String(user.company) !== String(companyId) && user.role !== 'SUPER_ADMIN') return res.status(403).json({ msg: 'Access denied' });

    const invoices = await Invoice.find({ 'perCompanyStatus.company': companyId }).sort({ createdAt: -1 }).lean();
    res.status(200).json({ invoices });
  }catch(err){ console.error(err); res.status(500).json({ msg: 'Server error' }); }
};

// Company accepts invoice (for their company entry)
exports.companyAccept = async (req, res) => {
  try{
    const { companyId, invoiceId } = req.params;
    const userId = req.user?.id || req.user?._id || req.user;
    const user = await User.findById(userId);
    if (!user || String(user.company) !== String(companyId)) return res.status(403).json({ msg: 'Access denied' });

    const invoice = await Invoice.findById(invoiceId);
    if(!invoice) return res.status(404).json({ msg: 'Invoice not found' });

    const entry = invoice.perCompanyStatus.find(p=> String(p.company) === String(companyId));
    if(!entry) return res.status(404).json({ msg: 'Invoice not for this company' });
    if(entry.status !== 'PENDING') return res.status(400).json({ msg: 'Cannot accept at this stage' });

    entry.status = 'ACCEPTED';
    entry.acceptedAt = new Date();
    invoice.actionHistory.push({ actorRole: 'COMPANY', actorId: userId, action: 'ACCEPTED', note: 'Company accepted invoice' });

    // compute overall status
    const statuses = invoice.perCompanyStatus.map(p=>p.status);
    if (statuses.every(s=> s === 'ACCEPTED')) invoice.status = 'ACCEPTED';
    else invoice.status = 'PARTIALLY_ACCEPTED';

    await invoice.save();

    res.status(200).json({ invoice });
  }catch(err){ console.error(err); res.status(500).json({ msg: 'Server error' }); }
};

// Company pay invoice (mark company's entry as PAID)
exports.companyPay = async (req, res) => {
  try{
    const { companyId, invoiceId } = req.params;
    const { paymentInfo } = req.body;
    const userId = req.user?.id || req.user?._id || req.user;
    const user = await User.findById(userId);
    if (!user || String(user.company) !== String(companyId)) return res.status(403).json({ msg: 'Access denied' });

    const invoice = await Invoice.findById(invoiceId);
    if(!invoice) return res.status(404).json({ msg: 'Invoice not found' });

    const entry = invoice.perCompanyStatus.find(p=> String(p.company) === String(companyId));
    if(!entry) return res.status(404).json({ msg: 'Invoice not for this company' });
    if(entry.status !== 'ACCEPTED') return res.status(400).json({ msg: 'Cannot pay before acceptance' });

    entry.status = 'PAID';
    entry.paidAt = new Date();
    entry.paymentInfo = paymentInfo || {};
    invoice.actionHistory.push({ actorRole: 'COMPANY', actorId: userId, action: 'PAID', note: 'Company paid invoice' });

    const statuses = invoice.perCompanyStatus.map(p=>p.status);
    if (statuses.every(s=> s === 'PAID')) invoice.status = 'PAID';
    else invoice.status = 'PARTIALLY_PAID';

    await invoice.save();

    // notify super admin about payment
    try{
      const admin = process.env.SUPERADMIN_EMAIL;
      if (admin) await sendEmail(admin, `Invoice #${invoice.number} paid by company`, `Invoice ${invoice.number} has been paid by company ${companyId}`);
    }catch(e){ console.error('email failed', e); }

    res.status(200).json({ invoice });
  }catch(err){ console.error(err); res.status(500).json({ msg: 'Server error' }); }
};
