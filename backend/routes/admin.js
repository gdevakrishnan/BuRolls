const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const rbac = require("../middleware/rbac");
const { getOverview } = require("../controllers/adminController");

router.get("/overview", auth, rbac("SUPER_ADMIN"), getOverview);

module.exports = router;