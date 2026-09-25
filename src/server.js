const express = require('express');
const path = require('path');
const cors = require('cors');

const productRoutes = require('./routes/products');
const reviewRoutes = require('./routes/reviews');
const shippingRoutes = require('./routes/shipping');
const invoiceRoutes = require('./routes/invoices');
const supplierRoutes = require('./routes/suppliers');
const secretsConfig = require('./config/payment');

const app = express();
const PORT = process.env.PORT || 8080;

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// FIXED CORS CONFIGURATION (CWE-942): Replaced wildcard with specific origin to allow credentials safely
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN || "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// Serve frontend assets
app.use(express.static(path.join(__dirname, '../public')));

// Mount API routes
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/shipping', shippingRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/suppliers', supplierRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Scamazon Storefront & Fulfillment Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Root fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`📦 Scamazon E-Commerce Platform is LIVE!`);
  console.log(`👉 Web Storefront: http://localhost:${PORT}`);
  console.log(`🔒 Intentionally configured for Sentinel Security Auditing`);
  console.log('====================================================');
});