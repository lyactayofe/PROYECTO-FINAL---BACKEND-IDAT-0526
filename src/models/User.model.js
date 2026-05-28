// ===================================
// MODELO USER
// ===================================

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "El nombre es obligatorio"], trim: true },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v) => /^[\w.-]+@[\w.-]+\.\w{2,}$/.test(v),
        message: "Email inválido",
      },
    },
    
    password: { type: String, required: true, select: false },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
