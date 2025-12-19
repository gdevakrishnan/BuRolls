const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const rbac = require("../middleware/rbac");
const { createBusinessUnit, getAllBusinessUnits, updateBusinessUnit, assignManagerAccess } = require("../controllers/businessUnitController");

router.post("/", auth, rbac("SUPER_ADMIN"), createBusinessUnit);
router.get("/", auth, getAllBusinessUnits);
router.put("/:id", auth, rbac("SUPER_ADMIN","BU_MANAGER"), updateBusinessUnit);
router.post("/:id/assign-manager", auth, rbac("SUPER_ADMIN"), assignManagerAccess);

module.exports = router;