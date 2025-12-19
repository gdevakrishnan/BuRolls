const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const rbac = require("../middleware/rbac");
const { requestUser, approveUser } = require("../controllers/userController");

router.post("/request", requestUser);
router.post("/approve/:userId", auth, rbac("SUPER_ADMIN"), approveUser);

module.exports = router;
