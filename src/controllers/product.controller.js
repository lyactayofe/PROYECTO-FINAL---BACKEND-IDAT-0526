// ===================================
// CONTROLADOR DE PRODUCTOS
// ===================================

const Product = require("../models/Product.model");
const { appError } = require("../middleware/errorHandler");
const { getPagination, paginatedResponse } = require("../utils/pagination");

// ===================================
// LISTAR TODOS LOS PRODUCTOS
// GET /api/products?page=1&pageSize=10&minPrice=10&maxPrice=30
// ===================================
const getProducts = async (req, res, next) => {
  try {
    const { page, pageSize, limit, skip } = getPagination(req.query);

    const filter = { available: true };
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort({ category: 1, name: 1 })
      .limit(limit)
      .skip(skip);

    return res.status(200).json({
      status: "ok",
      ...paginatedResponse(total, products, page, pageSize),
    });
  } catch (error) {
    next(error);
  }
};

// ===================================
// BUSCAR PRODUCTOS POR NOMBRE O DESCRIPCIÓN
// GET /api/products/search?q=hamburguesa
// ===================================
const searchProducts = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return next(appError(400, "MISSING_QUERY", "Ingresa un término con ?q=..."));
    }

    const { page, pageSize, limit, skip } = getPagination(req.query);

    const filter = {
      available: true,
      $or: [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ],
    };

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter).limit(limit).skip(skip);

    return res.status(200).json({
      status: "ok",
      query: q,
      ...paginatedResponse(total, products, page, pageSize),
    });
  } catch (error) {
    next(error);
  }
};

// ===================================
// FILTRAR POR CATEGORÍA
// GET /api/products/category/hamburguesas
// ===================================
const getByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const validCategories = ["hamburguesas", "bebidas", "combos", "papas"];

    if (!validCategories.includes(category)) {
      return next(
        appError(400, "INVALID_CATEGORY", `Categoría inválida. Válidas: ${validCategories.join(", ")}`)
      );
    }

    const { page, pageSize, limit, skip } = getPagination(req.query);
    const filter = { category, available: true };

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter).limit(limit).skip(skip);

    return res.status(200).json({
      status: "ok",
      category,
      ...paginatedResponse(total, products, page, pageSize),
    });
  } catch (error) {
    next(error);
  }
};

// ===================================
// OBTENER UN PRODUCTO POR ID
// GET /api/products/:id
// ===================================
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(appError(404, "PRODUCT_NOT_FOUND", "Producto no encontrado"));
    }
    return res.status(200).json({ status: "ok", data: product });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, searchProducts, getByCategory, getProductById };
