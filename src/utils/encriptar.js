// ===================================
// ENCRIPTAR 
// ===================================

const bcrypt = require("bcryptjs");

const passEncrypt = async (password) => {
  return await bcrypt.hash(password, 10);
};

const comparePass = async (password, passwordHash) => {
  return await bcrypt.compare(password, passwordHash);
};

module.exports = { passEncrypt, comparePass };
