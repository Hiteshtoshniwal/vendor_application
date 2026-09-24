// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------
function initPage(activePage) {
  const nav = document.getElementById("topbar");
  const links = [
    { href: "/dashboard.html", label: "Dashboard", key: "dashboard" },
    { href: "/inventory.html", label: "Inventory", key: "inventory" },
    { href: "/receivables.html", label: "Receivables", key: "receivables" },
    { href: "/reports.html", label: "Reports", key: "reports" },
  ];

  nav.innerHTML = `
    <div class="brand">Vendor Manager</div>
    <button class="hamburger-btn" id="hamburgerBtn" aria-label="Menu">☰</button>
    <nav id="navLinks">
      ${links.map(l => `<a href="${l.href}" class="${l.key === activePage ? "active" : ""}">${l.label}</a>`).join("")}
    </nav>
    <div class="user-area">
      <button class="icon-btn" id="themeToggleBtn" title="Toggle dark mode">🌙</button>
    </div>
  `;

  initTheme();
  document.getElementById("themeToggleBtn").addEventListener("click", toggleTheme);
  const hamburger = document.getElementById("hamburgerBtn");
  const navLinks = document.getElementById("navLinks");
  hamburger.addEventListener("click", () => navLinks.classList.toggle("open"));
  registerServiceWorker();
}

// ---------------------------------------------------------------------------
// Dark mode
// ---------------------------------------------------------------------------
function initTheme() {
  const saved = localStorage.getItem("theme");
  const theme = saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  applyTheme(theme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const btn = document.getElementById("themeToggleBtn");
  if (btn) btn.textContent = theme === "dark" ? "☀️" : "🌙";
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  const next = current === "dark" ? "light" : "dark";
  localStorage.setItem("theme", next);
  applyTheme(next);
}

// ---------------------------------------------------------------------------
// Toast notifications (replaces alert())
// ---------------------------------------------------------------------------
function ensureToastContainer() {
  let el = document.getElementById("toastContainer");
  if (!el) {
    el = document.createElement("div");
    el.id = "toastContainer";
    el.className = "toast-container";
    document.body.appendChild(el);
  }
  return el;
}

function toast(message, type = "success", duration = 3500) {
  const container = ensureToastContainer();
  const el = document.createElement("div");
  el.className = `toast toast-${type}`;
  el.innerHTML = `<span>${escapeHtml(message)}</span>`;
  container.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 250);
  }, duration);
  return el;
}

// A toast with an inline "Undo" action button (used after soft-deletes).
function toastWithUndo(message, onUndo, duration = 6000) {
  const container = ensureToastContainer();
  const el = document.createElement("div");
  el.className = "toast toast-info";
  el.innerHTML = `<span>${escapeHtml(message)}</span> <button class="toast-undo-btn">Undo</button>`;
  container.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));

  const remove = () => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 250);
  };
  const timer = setTimeout(remove, duration);
  el.querySelector(".toast-undo-btn").addEventListener("click", () => {
    clearTimeout(timer);
    remove();
    onUndo();
  });
}

// ---------------------------------------------------------------------------
// Custom confirm dialog (replaces browser confirm())
// ---------------------------------------------------------------------------
function confirmDialog(message, { title = "Are you sure?", confirmLabel = "Delete", danger = true } = {}) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay open";
    overlay.innerHTML = `
      <div class="modal">
        <h3>${escapeHtml(title)}</h3>
        <p style="color:var(--muted); font-size:0.9rem;">${escapeHtml(message)}</p>
        <div class="modal-actions">
          <button class="btn btn-secondary" id="confirmCancelBtn">Cancel</button>
          <button class="btn ${danger ? "btn-danger" : "btn-primary"}" id="confirmOkBtn">${escapeHtml(confirmLabel)}</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    const cleanup = (result) => {
      overlay.remove();
      resolve(result);
    };
    overlay.querySelector("#confirmCancelBtn").addEventListener("click", () => cleanup(false));
    overlay.querySelector("#confirmOkBtn").addEventListener("click", () => cleanup(true));
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) cleanup(false);
    });
  });
}

// ---------------------------------------------------------------------------
// PWA install support
// ---------------------------------------------------------------------------
function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js").catch(() => {});
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function money(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}
