// ===================================
// CONTROLADOR DE AUTENTICACIÓN
// Con logout real usando blacklist 
// ===================================

const User = require("../models/User.model");
const { passEncrypt, comparePass } = require("../utils/encriptar");
const { generateToken } = require("../utils/jwt.handle");
const { appError } = require("../middleware/errorHandler");
const { tokenBlackList } = require("../middleware/auth.middleware");

// ===================================
// REGISTRO DE USUARIO
// POST /api/auth/register
// ===================================
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return next(appError(400, "MISSING_FIELDS", "Nombre, email y contraseña son obligatorios"));
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return next(appError(400, "EMAIL_EXISTS", "Este email ya está registrado"));
    }

    const hashPass = await passEncrypt(password);

    const user = await User.create({ name, email, password: hashPass, phone, address });

    const token = generateToken(user._id.toString());

    return res.status(201).json({
      status: "ok",
      message: "Usuario registrado correctamente",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

// ===================================
// LOGIN DE USUARIO
// POST /api/auth/login
// ===================================
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(appError(400, "MISSING_FIELDS", "Email y contraseña son obligatorios"));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(appError(401, "USER_NOT_FOUND", "Email o contraseña incorrectos"));
    }

    const isCorrect = await comparePass(password, user.password);
    if (!isCorrect) {
      return next(appError(401, "PASSWORD_INCORRECT", "Email o contraseña incorrectos"));
    }

    const token = generateToken(user._id.toString());

    return res.status(200).json({
      status: "ok",
      data: token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

// ===================================
// LOGOUT - Revoca el token (blacklist)
// POST /api/auth/logout
// ===================================
const logout = (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.replace("Bearer ", "");
    if (token) {
      // Agregamos el token a la lista negra
      tokenBlackList.add(token);
    }
    return res.status(200).json({ status: "ok", message: "Sesión cerrada correctamente" });
  } catch (error) {
    next(error);
  }
};

// ===================================
// VER MI PERFIL
// GET /api/auth/profile (requiere token)
// ===================================
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return next(appError(404, "USER_NOT_FOUND", "Usuario no encontrado"));
    }
    return res.status(200).json({ status: "ok", data: user });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, logout, getProfile };
