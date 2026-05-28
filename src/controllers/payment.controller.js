// ===================================
// CONTROLADOR DE PAGOS
// ===================================

const Cart = require("../models/Cart.model");
const Order = require("../models/Order.model");
const Coupon = require("../models/Coupon.model");
const { appError } = require("../middleware/errorHandler");

// ===================================
// SIMULADOR DE PAGO
// ===================================
const simulatePayment = (cardNumber, amount) => {
  // Tarjetas que APRUEBAN el pago, es solo para pruebas
  const approvedCards = [
    "4111111111111111", // Visa aprobada
    "5111111111111118", // Mastercard aprobada
    "4000000000000000", // Visa aprobada
  ];

  // Tarjeta que RECHAZA el pago, es solo para probar el error
  const declinedCard = "4000000000000002";

  if (cardNumber === declinedCard) {
    return {
      success: false,
      message: "Tarjeta rechazada (simulación)",
    };
  }

  if (approvedCards.includes(cardNumber) || cardNumber) {

    const fakeChargeId = "chr_test_" + Math.random().toString(36).substr(2, 16).toUpperCase();
    return {
      success: true,
      chargeId: fakeChargeId,
      amount,
      message: "Pago aprobado (simulación)",
    };
  }

  return { success: false, message: "Datos de tarjeta inválidos" };
};

// ===================================
// CREAR PAGO (SIMULADO)
// POST /api/payment/create
//
// Body: {
//   card_number: "4111111111111111",  ← tarjeta de prueba
//   cvv: "123",
//   expiration_month: "09",
//   expiration_year: "2025",
//   deliveryAddress: "Av. Lima 334"
// }
// ===================================
const createPayment = async (req, res, next) => {
  try {
    const { card_number, cvv, expiration_month, expiration_year, deliveryAddress } = req.body;

    if (!card_number || !cvv || !expiration_month || !expiration_year) {
      return next(
        appError(400, "MISSING_CARD_DATA", "Se requieren: card_number, cvv, expiration_month, expiration_year")
      );
    }

    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product", "name price");
    if (!cart || cart.items.length === 0) {
      return next(appError(400, "EMPTY_CART", "Tu carrito está vacío. Agrega productos primero."));
    }

    const amountInCents = Math.round(cart.total * 100);
    const paymentResult = simulatePayment(card_number, amountInCents);

    if (!paymentResult.success) {
      return next(appError(400, "PAYMENT_REJECTED", paymentResult.message));
    }

    const order = new Order({
      user: req.user.id,
      items: cart.items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        price: item.price,
        quantity: item.quantity,
      })),
      coupon: cart.coupon,
      discount: cart.discount,
      total: cart.total,
      status: "Pendiente",
      deliveryAddress: deliveryAddress || "",
      payment: {
        chargeId: paymentResult.chargeId,  // ID simulado
        method: "Tarjeta",
        status: "Pagado",
      },
    });

    await order.save();

    if (cart.coupon) {
      await Coupon.findOneAndUpdate({ code: cart.coupon }, { $inc: { usedCount: 1 } });
    }

    cart.items = [];
    cart.coupon = null;
    cart.discount = 0;
    cart.total = 0;
    await cart.save();

    return res.status(201).json({
      status: "ok",
      message: "✅ Pago exitoso. ¡Tu pedido fue creado!",
      data: {
        orderId: order._id,
        total: order.total,
        status: order.status,
        chargeId: paymentResult.chargeId,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ===================================
// CONFIRMAR PEDIDO (cambiar estado)
// POST /api/payment/confirm
// Body: { orderId: "..." }
// ===================================
const confirmPayment = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return next(appError(400, "MISSING_FIELDS", "orderId es requerido"));

    const order = await Order.findOne({ _id: orderId, user: req.user.id });
    if (!order) return next(appError(404, "ORDER_NOT_FOUND", "Pedido no encontrado"));

    order.status = "Preparando";
    await order.save();

    return res.status(200).json({
      status: "ok",
      message: "Pedido confirmado. Estado actualizado a: Preparando",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createPayment, confirmPayment };
