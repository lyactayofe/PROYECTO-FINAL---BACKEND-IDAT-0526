// ===================================
// BURGERHOUSE API - Archivo principal
// ===================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/database");

const authRoutes    = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const cartRoutes    = require("./routes/cart.routes");
const paymentRoutes = require("./routes/payment.routes");
const orderRoutes   = require("./routes/order.routes");

const { logger }       = require("./middleware/logger");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

// ===================================
// MIDDLEWARES GLOBALES
// ===================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// ===================================
// FRONTEND ESTÁTICO
// Sirve el archivo public/index.html en la raíz
// Acceder en: http://localhost:3000
// ===================================
app.use(express.static(path.join(__dirname, "../public")));

// ===================================
// RUTAS DE LA API
// ===================================
app.use("/api/auth",    authRoutes);
app.use("/api/products",productRoutes);
app.use("/api/cart",    cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders",  orderRoutes);

// Ruta no encontrada
app.use((req, res, next) => {
  const { appError } = require("./middleware/errorHandler");
  next(appError(404, "NOT_FOUND", `Ruta ${req.originalUrl} no encontrada`));
});

// Manejador global de errores
app.use(errorHandler);

// ===================================
// INICIO DEL SERVIDOR
// ===================================
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🍔 BurgerHouse API corriendo en puerto: ${PORT}`);
    console.log(`🌐 Frontend: http://localhost:${PORT}`);
    console.log(`📡 API:      http://localhost:${PORT}/api`);
    console.log(`📚 Docs:     http://localhost:${PORT}/api/docs`);
    console.log(`📦 MongoDB conectado`);
    console.log(`==================================================\n`);
  });
});
