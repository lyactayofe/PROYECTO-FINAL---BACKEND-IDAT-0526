// ===================================
// CONTROLADOR DE PEDIDOS
// ===================================

const Order = require("../models/Order.model");
const { appError } = require("../middleware/errorHandler");
const { getPagination, paginatedResponse } = require("../utils/pagination");

// GET /api/orders
const getOrders = async (req, res, next) => {
  try {
    const { page, pageSize, limit, skip } = getPagination(req.query);

    const filter = { user: req.user.id };
    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate("items.product", "name image")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    return res.status(200).json({
      status: "ok",
      ...paginatedResponse(total, orders, page, pageSize),
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/:id
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id })
      .populate("items.product", "name image category");

    if (!order) return next(appError(404, "ORDER_NOT_FOUND", "Pedido no encontrado"));

    return res.status(200).json({ status: "ok", data: order });
  } catch (error) {
    next(error);
  }
};

module.exports = { getOrders, getOrderById };
