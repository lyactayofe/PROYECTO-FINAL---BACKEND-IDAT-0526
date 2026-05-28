// ===================================
// MIDDLEWARE DE AUTENTICACIÓN JWT
// ===================================

const { verifyToken } = require("../utils/jwt.handle");
const { appError } = require("./errorHandler");

const tokenBlackList = new Set();

const verifyTokenMiddleware = (req, res, next) => {
  try {

    const authHeader = req.headers["authorization"];
    let token = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return next(appError(401, "NO_TOKEN", "No autorizado. Debes iniciar sesión."));
    }

    if (tokenBlackList.has(token)) {
      return next(appError(401, "TOKEN_REVOKED", "Token revocado. Vuelve a iniciar sesión."));
    }

    const decoded = verifyToken(token);

    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(appError(401, "INVALID_TOKEN", "Token inválido."));
    }
    if (error.name === "TokenExpiredError") {
      return next(appError(401, "TOKEN_EXPIRED", "Token expirado. Vuelve a iniciar sesión."));
    }
    next(error);
  }
};

module.exports = { verifyTokenMiddleware, tokenBlackList };
