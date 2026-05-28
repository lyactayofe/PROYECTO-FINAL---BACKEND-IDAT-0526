// ===================================
// MODELO COUPON (Cupón de descuento)
// ===================================

const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true, 
      trim: true,
    },

    discount: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },

    active: {
      type: Boolean,
      default: true,
    },

    maxUses: {
      type: Number,
      default: null,
    },

    usedCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Coupon", couponSchema);
