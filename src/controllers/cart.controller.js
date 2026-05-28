// ===================================
// CONTROLADOR DEL CARRITO
// ===================================

const Cart = require("../models/Cart.model");
const Product = require("../models/Product.model");
const Coupon = require("../models/Coupon.model");
const { appError } = require("../middleware/errorHandler");

const calculateTotal = (items, discount = 0) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discount) / 100;
  return Math.round((subtotal - discountAmount) * 100) / 100;
};

// POST /api/cart/add
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) return next(appError(400, "MISSING_FIELDS", "productId es requerido"));

    const product = await Product.findById(productId);
    if (!product || !product.available) {
      return next(appError(404, "PRODUCT_NOT_FOUND", "Producto no encontrado o no disponible"));
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) cart = new Cart({ user: req.user.id, items: [], total: 0 });

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({ product: productId, quantity: Number(quantity), price: product.price });
    }

    cart.total = calculateTotal(cart.items, cart.discount);
    await cart.save();
    await cart.populate("items.product", "name image price category");

    return res.status(200).json({ status: "ok", message: "Producto agregado al carrito", data: cart });
  } catch (error) {
    next(error);
  }
};

// GET /api/cart
const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product", "name image price category"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({ status: "ok", message: "Tu carrito está vacío", data: { items: [], total: 0 } });
    }

    return res.status(200).json({ status: "ok", data: cart });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/cart/remove/:productId
const removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return next(appError(404, "CART_NOT_FOUND", "Carrito no encontrado"));

    const originalLength = cart.items.length;
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    if (cart.items.length === originalLength) {
      return next(appError(404, "ITEM_NOT_FOUND", "Producto no encontrado en el carrito"));
    }

    cart.total = calculateTotal(cart.items, cart.discount);
    await cart.save();

    return res.status(200).json({ status: "ok", message: "Producto eliminado del carrito", data: cart });
  } catch (error) {
    next(error);
  }
};

// POST /api/cart/coupon
const applyCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) return next(appError(400, "MISSING_FIELDS", "Ingresa un código de cupón"));

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true });
    if (!coupon) return next(appError(404, "COUPON_NOT_FOUND", "Cupón inválido o expirado"));

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return next(appError(400, "COUPON_LIMIT_REACHED", "Este cupón ya llegó a su límite de usos"));
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart || cart.items.length === 0) {
      return next(appError(400, "EMPTY_CART", "Tu carrito está vacío"));
    }

    cart.coupon = coupon.code;
    cart.discount = coupon.discount;
    cart.total = calculateTotal(cart.items, coupon.discount);
    await cart.save();

    return res.status(200).json({
      status: "ok",
      message: `Cupón aplicado: ${coupon.discount}% de descuento`,
      discount: coupon.discount,
      newTotal: cart.total,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { addToCart, getCart, removeFromCart, applyCoupon };
