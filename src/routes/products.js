const express = require('express');
const router = express.Router();
const db = require('../database/db');

/**
 * GET /api/products
 * Fetch all catalog products
 */
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    total: db.getAllProducts().length,
    products: db.getAllProducts()
  });
});

/**
 * GET /api/products/search
 * Search products by keyword
 */
router.get('/search', async (req, res) => {
  const searchTerm = req.query.q || '';

  try {
    const sql = "SELECT * FROM products WHERE name LIKE ? OR description LIKE ?";
    const results = await db.query(sql, [`%${searchTerm}%`, `%${searchTerm}%`]);

    res.json({
      status: 'success',
      query: searchTerm,
      sqlExecuted: sql,
      count: results.length,
      products: results
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

/**
 * GET /api/products/:id
 * Retrieve product details
 */
router.get('/:id', (req, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ status: 'error', message: 'Product not found' });
  }
  const reviews = db.getReviews(req.params.id);
  res.json({ status: 'success', product, reviews });
});

module.exports = router;