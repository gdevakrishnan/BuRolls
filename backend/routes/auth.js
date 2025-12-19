const express = require("express");
const router = express.Router();
const { registerSuperAdmin, login } = require("../controllers/authController");

router.post("/register-superadmin", registerSuperAdmin);
router.post("/login", login);

module.exports = router;
