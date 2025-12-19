const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { registerSuperAdmin, login, me } = require("../controllers/authController");

router.post("/register-superadmin", registerSuperAdmin);
router.post("/login", login);
router.post("/forgot-password", require("../controllers/authController").forgotPassword);
router.post("/change-password", auth, require("../controllers/authController").changePassword);
router.get("/me", auth, me);

module.exports = router;
