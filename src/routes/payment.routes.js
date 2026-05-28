const express = require("express");
const router = express.Router();
const { createPayment, confirmPayment } = require("../controllers/payment.controller");
const { verifyTokenMiddleware } = require("../middleware/auth.middleware");

router.use(verifyTokenMiddleware);
router.post("/create", createPayment);
router.post("/confirm", confirmPayment);

module.exports = router;
