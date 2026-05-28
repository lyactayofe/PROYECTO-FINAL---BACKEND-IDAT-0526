// ===================
// RUTAS DE PRODUCTOS 
// ==================
const express = require("express");
const router = express.Router();
const { getProducts, searchProducts, getByCategory, getProductById } = require("../controllers/product.controller");

router.get("/", getProducts);                        
router.get("/search", searchProducts);               
router.get("/category/:category", getByCategory);    
router.get("/:id", getProductById);                  

module.exports = router;
