const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const rbac = require("../middleware/rbac");
const { getOverview, getStats, getManagers, getUsers } = require("../controllers/adminController");

router.get("/overview", auth, rbac("SUPER_ADMIN"), getOverview);
router.get("/stats", auth, rbac("SUPER_ADMIN"), getStats);
router.get("/managers", auth, rbac("SUPER_ADMIN"), getManagers);
router.get("/users", auth, rbac("SUPER_ADMIN"), getUsers);

module.exports = router;