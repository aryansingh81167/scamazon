/**
 * Scamazon Client-Side Interactivity
 */

let cartCount = 2;

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();

  // Search input listeners
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');

  searchBtn.addEventListener('click', performSearch);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
  });
});

async function loadProducts() {
  try {
    const res = await fetch('/api/products');
    const data = await res.json();
    renderProducts(data.products || []);
  } catch (err) {
    console.error('Failed to load products:', err);
  }
}

async function performSearch() {
  const query = document.getElementById('searchInput').value.trim();
  if (!query) {
    clearSearch();
    return;
  }

  try {
    const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();

    document.getElementById('searchInfoBar').style.display = 'flex';
    document.getElementById('searchQueryLabel').innerText = query;
    document.getElementById('sqlExecutedBadge').innerText = `SQL: ${data.sqlExecuted || 'Executed'}`;

    renderProducts(data.products || []);
  } catch (err) {
    console.error('Search failed:', err);
  }
}

function clearSearch() {
  document.getElementById('searchInput').value = '';
  document.getElementById('searchInfoBar').style.display = 'none';
  loadProducts();
}

function renderProducts(products) {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';

  if (products.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #555;">No products matched your search. Try searching <code>Echo</code> or testing SQL Injection with <code>' OR '1'='1</code>.</div>`;
    return;
  }

  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';

    const stars = generateStars(p.rating);

    card.innerHTML = `
      ${p.badge ? `<span class="badge-tag">${p.badge}</span>` : ''}
      <div class="product-img-wrapper">
        <img src="${p.image}" alt="${p.name}" class="product-img">
      </div>
      <div class="product-category">${p.category}</div>
      <h3 class="product-title" title="${p.name}">${p.name}</h3>
      <div class="product-rating">
        <div class="stars">${stars}</div>
        <span class="review-count">(${p.reviews_count.toLocaleString()})</span>
      </div>
      <div class="product-price-row">
        <span class="price-symbol">$</span>
        <span class="price-main">${p.price.toFixed(2)}</span>
        ${p.original_price ? `<span class="price-original">$${p.original_price.toFixed(2)}</span>` : ''}
      </div>
      <div class="prime-badge">
        <i class="fa-solid fa-check"></i> prime
      </div>
      <button class="add-to-cart-btn" onclick="addToCart('${p.name}')">Add to Cart</button>
    `;
    grid.appendChild(card);
  });
}

function generateStars(rating) {
  let starsHtml = '';
  const full = Math.floor(rating);
  for (let i = 0; i < full; i++) starsHtml += '<i class="fa-solid fa-star"></i>';
  if (rating % 1 !== 0) starsHtml += '<i class="fa-solid fa-star-half-stroke"></i>';
  return starsHtml;
}

function addToCart(title) {
  cartCount++;
  document.getElementById('cartCount').innerText = cartCount;
  alert(`Added to Scamazon Cart:\n"${title}"\n\nTotal Items: ${cartCount}`);
}

function scrollToProducts() {
  document.getElementById('productsSection').scrollIntoView({ behavior: 'smooth' });
}

/* Security Demonstration Interactive Functions */

async function testCourierPing() {
  const host = document.getElementById('pingHostInput').value;
  const outputEl = document.getElementById('pingResult');
  outputEl.innerText = 'Pinging regional logistics hub...';

  try {
    const res = await fetch('/api/shipping/ping-hub', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ host })
    });
    const data = await res.json();
    outputEl.innerText = JSON.stringify(data, null, 2);
  } catch (err) {
    outputEl.innerText = 'Ping failed: ' + err.message;
  }
}

async function previewReviewXSS() {
  const author = document.getElementById('xssAuthorInput').value;
  const comment = document.getElementById('xssCommentInput').value;
  const previewEl = document.getElementById('xssResult');

  try {
    const res = await fetch(`/api/reviews/render?author=${encodeURIComponent(author)}&comment=${encodeURIComponent(comment)}`);
    const html = await res.text();
    previewEl.textContent = html; // Demonstrates XSS trigger
  } catch (err) {
    previewEl.innerText = 'Error: ' + err.message;
  }
}

async function downloadInvoice() {
  const file = document.getElementById('invoiceFileInput').value;
  const outputEl = document.getElementById('invoiceResult');
  outputEl.innerText = 'Retrieving invoice file...';

  try {
    const res = await fetch(`/api/invoices/download?file=${encodeURIComponent(file)}`);
    const text = await res.text();
    outputEl.innerText = text;
  } catch (err) {
    outputEl.innerText = 'Download failed: ' + err.message;
  }
}

async function testSupplierWebhook() {
  const url = document.getElementById('ssrfUrlInput').value;
  const outputEl = document.getElementById('ssrfResult');
  outputEl.innerText = 'Testing webhook connectivity...';

  try {
    const res = await fetch(`/api/suppliers/test-webhook?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    outputEl.innerText = JSON.stringify(data, null, 2);
  } catch (err) {
    outputEl.innerText = 'Webhook probe failed: ' + err.message;
  }
}
