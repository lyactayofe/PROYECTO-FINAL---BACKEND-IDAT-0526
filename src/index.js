// ===================================
// BURGERHOUSE API 
// ===================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");

// Importación de rutas
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/cart.routes");
const paymentRoutes = require("./routes/payment.routes");
const orderRoutes = require("./routes/order.routes");

// Importación de middlewares globales
const { logger } = require("./middleware/logger");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

// ======================
// MIDDLEWARES GLOBALES
// ======================
app.use(cors());
app.use(express.json());
app.use(logger); 

// ==========
// RUTA HOME
// ==========
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    app: "🍔 BurgerHouse API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    rutas: {
      auth: "/api/auth",
      productos: "/api/products",
      carrito: "/api/cart",
      pagos: "/api/payment",
      pedidos: "/api/orders",
    },
  });
});

// ======
// RUTAS
// =======
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);

// Ruta no encontrada
app.use((req, res, next) => {
  const { appError } = require("./middleware/errorHandler");
  next(appError(404, "NOT_FOUND", `Ruta ${req.originalUrl} no encontrada`));
});

// Manejador global de errores
app.use(errorHandler);

// =====================
// INICIO DEL SERVIDOR
// ====================
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🍔 BurgerHouse API corriendo en puerto: ${PORT}`);
    console.log(`🌐 http://localhost:${PORT}`);
    console.log(`📦 MongoDB conectado`);
    console.log(`==================================================\n`);
  });
});
