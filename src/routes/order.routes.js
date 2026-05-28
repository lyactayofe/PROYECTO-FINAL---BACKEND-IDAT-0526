const express = require("express");
const router = express.Router();
const { getOrders, getOrderById } = require("../controllers/order.controller");
const { verifyTokenMiddleware } = require("../middleware/auth.middleware");

router.use(verifyTokenMiddleware);
router.get("/", getOrders);
router.get("/:id", getOrderById);

module.exports = router;
