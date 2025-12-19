const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const rbac = require("../middleware/rbac");
const companyController = require("../controllers/companyController");
const { managerCreateUser } = require("../controllers/userController");

// Manager creates a company
router.post("/companies", auth, rbac("BU_MANAGER"), companyController.managerCreateCompany);
// Manager gets their companies
router.get("/companies", auth, rbac("BU_MANAGER"), companyController.getCompaniesForManager);
// Manager gets users for a specific company
router.get("/companies/:companyId/users", auth, rbac("BU_MANAGER"), companyController.getCompanyUsers);
// Manager creates a user under a company
router.post("/companies/:companyId/users", auth, rbac("BU_MANAGER"), managerCreateUser);

module.exports = router;