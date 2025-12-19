const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const rbac = require("../middleware/rbac");
const { requestUser, approveUser, getCurrentUser } = require("../controllers/userController");

router.post("/request", requestUser);
router.post("/approve/:userId", auth, rbac("SUPER_ADMIN"), approveUser);
router.post("/create-manager", auth, rbac("SUPER_ADMIN"), require("../controllers/userController").createManager);
router.get("/me", auth, getCurrentUser);

module.exports = router;
