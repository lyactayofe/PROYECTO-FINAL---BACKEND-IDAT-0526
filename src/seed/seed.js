// ===================================
// SEED - Datos de prueba
// ===================================



require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User.model");
const Product = require("../models/Product.model");
const Coupon = require("../models/Coupon.model");
const { passEncrypt } = require("../utils/encriptar");

const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

const products = [
  // HAMBURGUESAS
  { name: "Hamburguesa Clásica", description: "Carne 150g, lechuga, tomate, cebolla y mayonesa", price: 18.90, category: "hamburguesas" },
  { name: "Hamburguesa BBQ", description: "Carne 180g, tocino crocante, queso cheddar y salsa BBQ", price: 24.90, category: "hamburguesas" },
  { name: "Hamburguesa Doble", description: "Doble carne 200g, doble queso, salsa especial BurgerHouse", price: 29.90, category: "hamburguesas" },
  { name: "Hamburguesa Veggie", description: "Medallón de quinua y verduras, sin carne, con aguacate", price: 21.90, category: "hamburguesas" },
  // BEBIDAS
  { name: "Coca Cola", description: "Bebida gaseosa 500ml", price: 6.50, category: "bebidas" },
  { name: "Limonada Frozen", description: "Limonada helada con menta, 400ml", price: 9.90, category: "bebidas" },
  { name: "Agua Mineral", description: "Agua sin gas 625ml", price: 4.00, category: "bebidas" },
  { name: "Milkshake Vainilla", description: "Batido cremoso de vainilla con chantilly, 400ml", price: 12.90, category: "bebidas" },
  // COMBOS
  { name: "Combo Clásico", description: "Hamburguesa Clásica + Papas Medianas + Bebida", price: 29.90, category: "combos" },
  { name: "Combo BBQ Premium", description: "Hamburguesa BBQ + Papas Grandes + Bebida + Postre", price: 39.90, category: "combos" },
  { name: "Combo Familiar", description: "4 Hamburguesas + 4 Papas + 4 Bebidas", price: 89.90, category: "combos" },
  // PAPAS
  { name: "Papas Fritas Pequeñas", description: "Papas crujientes con sal, porción pequeña", price: 7.90, category: "papas" },
  { name: "Papas Fritas Medianas", description: "Papas crujientes con sal, porción mediana", price: 10.90, category: "papas" },
  { name: "Papas Fritas Grandes", description: "Papas crujientes con sal, porción grande", price: 13.90, category: "papas" },
  { name: "Papas con Queso", description: "Papas fritas bañadas en salsa de queso cheddar", price: 15.90, category: "papas" },
];

const coupons = [
  { code: "PROMO10", discount: 10, active: true, maxUses: 100 },
  { code: "BURGER20", discount: 20, active: true, maxUses: 50 },
  { code: "WELCOME15", discount: 15, active: true, maxUses: null },
];

const runSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("📂 Conectado a MongoDB");

    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Coupon.deleteMany({}),
    ]);
    console.log("🧹 Colecciones limpiadas");

    // ===== USUARIOS =====
    const users = await User.create([
      { name: "Admin BurgerHouse", email: "admin@burgerhouse.com", password: await passEncrypt("123456"), role: "admin" },
      { name: "Juan Pérez", email: "juan@test.com", password: await passEncrypt("123456"), role: "user" },
      { name: "Ana García", email: "ana@test.com", password: await passEncrypt("123456"), role: "user" },
    ]);
    console.log(`✅ ${users.length} usuarios creados`);

    // ===== PRODUCTOS =====
    await Product.insertMany(products);
    console.log(`✅ ${products.length} productos creados`);

    // ===== CUPONES =====
    await Coupon.insertMany(coupons);
    console.log(`✅ ${coupons.length} cupones creados`);

    console.log("\n🎉 Seed completado exitosamente!");
    console.log("   Credenciales de prueba:");
    console.log("   admin@burgerhouse.com / 123456  (admin)");
    console.log("   juan@test.com / 123456          (user)");
    console.log("   ana@test.com  / 123456          (user)");
    console.log("   Cupones: PROMO10, BURGER20, WELCOME15");

  } catch (error) {
    console.error("❌ Error en seed:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

runSeed();
