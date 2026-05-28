// ===================================
// MODELO PRODUCT (Producto)
// ===================================

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    //Hamburguesa Clásica
    name: {
      type: String,
      required: [true, "El nombre del producto es obligatorio"],
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
    },

    category: {
      type: String,
      required: true,
      enum: ["hamburguesas", "bebidas", "combos", "papas"], 
    },

    image: {
      type: String,
      default: "https://imag.bonviveur.com/hamburguesa-clasica.webp",
    },
 
    available: {
      type: Boolean,
      default: true,
    },

    stock: {
      type: Number,
      default: 100,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
