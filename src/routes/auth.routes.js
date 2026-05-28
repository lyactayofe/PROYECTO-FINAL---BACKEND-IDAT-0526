// ===================================
// RUTAS DE AUTENTICACIÓN
// ===================================
const express = require("express");
const router = express.Router();
const { register, login, logout, getProfile } = require("../controllers/auth.controller");
const { verifyTokenMiddleware } = require("../middleware/auth.middleware");

router.post("/register", register);          // Registro
router.post("/login", login);                // Login
router.post("/logout", verifyTokenMiddleware, logout); // Logout (revoca token)
router.get("/profile", verifyTokenMiddleware, getProfile); // Mi perfil

module.exports = router;
