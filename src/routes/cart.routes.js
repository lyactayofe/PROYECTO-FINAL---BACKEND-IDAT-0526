// ====================
// RUTAS DEL CARRITO 
// ======================
const express = require("express");
const router = express.Router();
const { addToCart, getCart, removeFromCart, applyCoupon } = require("../controllers/cart.controller");
const { verifyTokenMiddleware } = require("../middleware/auth.middleware");

router.use(verifyTokenMiddleware);

router.post("/add", addToCart);
router.get("/", getCart);
router.delete("/remove/:productId", removeFromCart);
router.post("/coupon", applyCoupon);

module.exports = router;
