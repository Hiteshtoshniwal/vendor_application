# Vendor Inventory & Receivables Manager

A simple web app to manage a local vendor's stock across three categories
(Oils, Kirana, Covers & Packing Material) and track money customers still
owe (credit sales / dues).

- **Backend:** Python (Flask, SQLAlchemy), SQLite database
- **Frontend:** Plain HTML, CSS, JavaScript (talks to the backend via a JSON API)
- **Auth:** none — the app opens straight to the dashboard, no login page

## Features

- Inventory CRUD across 3 categories, each item has quantity, unit,
  price/unit, low-stock threshold, notes
- Dashboard with total stock value, low-stock alerts, and total money
  outstanding from customers
- Receivables ("money to be received"): add a customer due, record partial
  or full payments over time, see running balance and status
  (pending / partial / paid)

> Since there's no login, anyone who can reach the app's URL can view and
> edit everything. That's fine for local/personal use on your own machine.
> If you deploy it online later and want to restrict access, let me know
> and I can add a simple login back in, or put it behind a shared
> password.

## 1. Setup

```bash
cd vendor_app
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## 2. Run it

```bash
python app.py
```

Open **http://localhost:5000** in your browser — it goes straight to the
dashboard, no login needed.

## 3. Project structure

```
vendor_app/
├── app.py              # Flask app + all API routes
├── models.py           # SQLAlchemy models (InventoryItem, Receivable, Payment)
├── requirements.txt
├── vendor.db            # created automatically on first run (SQLite)
└── static/
    ├── dashboard.html
    ├── inventory.html
    ├── receivables.html
    ├── css/style.css
    └── js/
        ├── common.js     # nav bar + shared helpers
        ├── dashboard.js
        ├── inventory.js
        └── receivables.js
```

## 4. How the data model works

- **InventoryItem**: one row per stock item. `category` is one of
  `oils`, `kirana`, `covers`. Stock value = quantity × price per unit.
  An item is flagged "low stock" once quantity drops to/under its
  threshold.
- **Receivable**: one row per customer credit balance
  (`total_amount` owed, `amount_paid` so far, `balance` = the difference).
- **Payment**: every time you record a payment against a receivable, it's
  logged here, so you keep a full history of who paid what and when.

## 5. Deploying later

When you're ready to put this online (you mentioned deploying later),
a few options that work well for a small Flask + SQLite app:

- **Render.com** or **Railway.app** — connect your GitHub repo, they
  detect `requirements.txt` and run `python app.py` (or a `gunicorn`
  command) automatically. Free/cheap tiers exist.
- **PythonAnywhere** — good for simple Flask apps, has a free tier.
- For anything beyond a handful of users, swap SQLite for PostgreSQL
  (Flask-SQLAlchemy makes this a one-line config change) since SQLite
  doesn't handle concurrent writes from multiple people well.

Before deploying:
1. Turn off `debug=True` in `app.run(...)`.
2. Use a production server (e.g. `gunicorn app:app`) instead of Flask's
   built-in dev server.
3. Since there's no login, avoid deploying it somewhere publicly
   reachable unless you're okay with anyone who has the link being able
   to view and edit your data — or ask me to add basic auth first.

## 6. Extending it

Ideas for later, if useful:
- Export inventory/receivables to Excel/CSV
- SMS/WhatsApp reminders for customers with overdue balances
- Barcode/SKU field on inventory items
- Purchase-order tracking (money you owe suppliers) as a second ledger
