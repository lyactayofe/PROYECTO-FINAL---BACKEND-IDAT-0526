// =============
// PAGINACIÓN 
// ===========

// Uso: GET /api/products?page=1&pageSize=10
const getPagination = (query, maxPageSize = 100) => {
  const page = Math.max(1, parseInt(query.page || "1", 10) || 1);
  const pageSize = Math.min(
    maxPageSize,
    Math.max(1, parseInt(query.pageSize || "10", 10) || 10)
  );
  return {
    page,
    pageSize,
    limit: pageSize,
    skip: (page - 1) * pageSize, 
  };
};

const paginatedResponse = (total, data, page, pageSize) => {
  return {
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    data,
  };
};

module.exports = { getPagination, paginatedResponse };
