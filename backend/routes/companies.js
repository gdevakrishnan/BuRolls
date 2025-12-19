const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const rbac = require("../middleware/rbac");
const { requestCompany, approveCompany } = require("../controllers/companyController");

// BU_USER requests company creation
router.post("/request", auth, rbac("BU_USER"), requestCompany);

// BU_MANAGER approves company
router.post("/approve/:companyId", auth, rbac("BU_MANAGER"), approveCompany);

// Company invoices (company users)
const invoiceController = require('../controllers/invoiceController');
router.get('/:companyId/invoices', auth, rbac('BU_USER','SUPER_ADMIN'), invoiceController.getCompanyInvoices);
router.post('/:companyId/invoices/:invoiceId/accept', auth, rbac('BU_USER'), invoiceController.companyAccept);
router.post('/:companyId/invoices/:invoiceId/pay', auth, rbac('BU_USER'), invoiceController.companyPay);

module.exports = router;
