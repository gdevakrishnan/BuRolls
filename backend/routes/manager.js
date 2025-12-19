const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const rbac = require("../middleware/rbac");
const companyController = require("../controllers/companyController");
const { managerCreateUser } = require("../controllers/userController");
const managerController = require("../controllers/managerController");

// Manager creates a company
router.post("/companies", auth, rbac("BU_MANAGER"), companyController.managerCreateCompany);
// Manager gets their companies
router.get("/companies", auth, rbac("BU_MANAGER"), companyController.getCompaniesForManager);
// Manager gets users for a specific company
router.get("/companies/:companyId/users", auth, rbac("BU_MANAGER"), companyController.getCompanyUsers);
// Manager creates a user under a company
router.post("/companies/:companyId/users", auth, rbac("BU_MANAGER"), managerCreateUser);

// Manager helpers: get assigned business units and stats
router.get("/business-units", auth, rbac("BU_MANAGER"), managerController.getAssignedBusinessUnits);
router.get("/stats", auth, rbac("BU_MANAGER"), managerController.getStats);
router.get("/users", auth, rbac("BU_MANAGER"), managerController.getUsers);

// Manager invoices
const invoiceController = require('../controllers/invoiceController');
router.post('/invoices', auth, rbac('BU_MANAGER'), invoiceController.createInvoice);
router.get('/invoices', auth, rbac('BU_MANAGER'), invoiceController.getManagerInvoices);
router.get('/invoices/:invoiceId', auth, rbac('BU_MANAGER'), invoiceController.getInvoiceById);

module.exports = router;