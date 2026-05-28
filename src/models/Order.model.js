// ===================================
// MODELO ORDER (Pedido)
// ===================================

const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  name: String,      
  price: Number,     
  quantity: Number,
});

const orderSchema = new mongoose.Schema(
  {
   
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [orderItemSchema],

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
      required: true,
    },

    status: {
      type: String,
      enum: ["Pendiente", "Preparando", "En camino", "Entregado"],
      default: "Pendiente",
    },

    // Información del pago, esta es la respuesta de Culqi
    payment: {
      chargeId: String,      // ID del cobro en Culqi
      method: String,        // Método de pago
      status: String,        // Estado del pago
    },

    // Dirección de entrega, en caso de que el usuario lo coloque
    deliveryAddress: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
