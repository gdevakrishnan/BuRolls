const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const rbac = require("../middleware/rbac");
const { requestCompany, approveCompany } = require("../controllers/companyController");

// BU_USER requests company creation
router.post("/request", auth, rbac("BU_USER"), requestCompany);

// BU_MANAGER approves company
router.post("/approve/:companyId", auth, rbac("BU_MANAGER"), approveCompany);

module.exports = router;
