const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const INVOICE_STORAGE_DIR = path.join(__dirname, '../../invoices');

// Ensure sample invoice directory and file exist
if (!fs.existsSync(INVOICE_STORAGE_DIR)) {
  fs.mkdirSync(INVOICE_STORAGE_DIR, { recursive: true });
}

const sampleInvoicePath = path.join(INVOICE_STORAGE_DIR, 'INV-2026-001.txt');
if (!fs.existsSync(sampleInvoicePath)) {
  fs.writeFileSync(
    sampleInvoicePath,
    'SCAMAZON ORDER RECEIPT\nOrder #SCAM-9812-4412\nItem: Scamazon Echo Dot (5th Gen)\nTotal: $49.99\nStatus: Delivered\n'
  );
}

/**
 * GET /api/invoices/download
 * Download customer order invoice
 * VULNERABILITY: Path Traversal (Arbitrary File Read / CWE-22)
 */
router.get('/download', (req, res) => {
  const fileName = req.query.file || 'INV-2026-001.txt';

  // REMEDIATED: Resolve path and verify it stays within the intended directory
  const baseDir = path.resolve(INVOICE_STORAGE_DIR);
  const targetPath = path.resolve(baseDir, fileName);

  if (!targetPath.startsWith(baseDir + path.sep)) {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied: Invalid file path'
    });
  }

  try {
    const fileContent = fs.readFileSync(targetPath, 'utf-8');
    res.setHeader('Content-Type', 'text/plain');
    res.send(fileContent);
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: 'Invoice not found or unreadable',
      pathAttempted: targetPath,
      error: error.message
    });
  }
});

module.exports = router;