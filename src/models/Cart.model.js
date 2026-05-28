// ===================================
// MODELO CART (Carrito de compras)
// ===================================

const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", 
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
    min: [1, "La cantidad mínima es 1"],
    default: 1,
  },

  price: {
    type: Number,
    required: true,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, 
    },

    items: [cartItemSchema],

    coupon: {
      type: String,
      default: null,
    },

    discount: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cart", cartSchema);
