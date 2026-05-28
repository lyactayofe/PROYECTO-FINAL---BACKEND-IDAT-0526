// ===================================
// VERIFY ADMIN MIDDLEWARE
// ===================================

const { appError } = require("./errorHandler");

const verifyAdmin = (req, res, next) => {

  if (!req.user || req.user.role !== "admin") {
    return next(appError(403, "ONLY_ADMINS", "Acceso solo para administradores"));
  }
  next();
};

module.exports = { verifyAdmin };
