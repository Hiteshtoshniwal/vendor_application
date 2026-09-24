(async function () {
  initPage("dashboard");

  const res = await fetch("/api/dashboard");
  const data = await res.json();

  const statCards = document.getElementById("statCards");
  statCards.innerHTML = `
    <div class="card stat-card">
      <div class="label">Total Stock Value</div>
      <div class="value">${money(data.total_stock_value)}</div>
      <div class="sub">${data.total_items} items across all categories</div>
    </div>
    <div class="card stat-card">
      <div class="label">Low Stock Alerts</div>
      <div class="value" style="color:${data.low_stock_count ? "var(--danger)" : "var(--text)"}">${data.low_stock_count}</div>
      <div class="sub">items at or below threshold</div>
    </div>
    <div class="card stat-card">
      <div class="label">Money to be Received</div>
      <div class="value" style="color:var(--warning)">${money(data.total_outstanding)}</div>
      <div class="sub">${data.total_customers_owing} customer(s) with dues</div>
    </div>
    <div class="card stat-card">
      <div class="label">Potential Profit</div>
      <div class="value" style="color:var(--success)">${money(data.total_potential_profit)}</div>
      <div class="sub">if all current stock sells at listed price</div>
    </div>
    <div class="card stat-card">
      <div class="label">Quick Links</div>
      <div style="color: black; margin-top:8px; display:flex; flex-direction:column; gap:8px;">
        <a class="btn btn-secondary btn-sm" href="/inventory.html">Manage Inventory</a>
        <a class="btn btn-secondary btn-sm" href="/receivables.html">Manage Receivables</a>
      </div>
    </div>
  `;

  const categoryCards = document.getElementById("categoryCards");
  categoryCards.innerHTML = Object.entries(data.by_category).map(([key, c]) => `
    <div class="card">
      <div class="label" style="color:var(--muted); font-size:0.85rem;">${c.label}</div>
      <div class="value" style="font-size:1.3rem; font-weight:700; margin:6px 0;">${money(c.stock_value)}</div>
      <div class="sub">${c.item_count} items ${c.low_stock_count ? `&middot; <span style="color:var(--danger)">${c.low_stock_count} low stock</span>` : ""}</div>
      <div class="sub" style="color:var(--success); margin-top:4px;">Potential profit: ${money(c.potential_profit)}</div>
      <a href="/inventory.html?category=${key}" class="btn btn-secondary btn-sm" style="margin-top:12px; display:inline-block;">View</a>
    </div>
  `).join("");
})();
