# 💸 TrackSpend — Personal Expense Tracker

> **Vibecoded** with [Antigravity](https://deepmind.google/) ✨

A clean, modern personal expense tracker built as a Single Page Application (SPA) using **AngularJS 1.8**. Track your spending, manage category budgets, and visualize where your money is going — all stored locally in your browser.

---

## 🚀 Features

- **Dashboard** — KPI cards showing total spent, total transactions, and highest spending category
- **Pie Chart** — Visual breakdown of spending by category using Chart.js
- **Budget Manager** — Set per-category budget limits with live progress bars and overspend warnings
- **Add / Edit Expenses** — Form with full validation to log new expenses or update existing ones
- **Expense History** — Searchable and filterable table of all logged expenses
- **Persistent Storage** — All data saved to `localStorage` — survives page refreshes

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| AngularJS 1.8 | SPA framework & routing (`ngRoute`) |
| Bootstrap 5.3 | Responsive layout & UI components |
| Bootstrap Icons | Icon library |
| Chart.js 3.9 | Pie chart data visualization |
| localStorage | Client-side data persistence |
| Vanilla CSS | Custom design system & animations |
| Google Fonts (Inter) | Typography |

---

## 📁 Project Structure

```
expense-tracker/
├── index.html                   # Main shell — loads all CSS, JS, and ng-view
├── css/
│   └── style.css                # Custom design system & component styles
├── js/
│   ├── app.js                   # AngularJS module & route configuration
│   ├── controllers/
│   │   ├── ExpenseCtrl.js       # Handles add / edit / delete expense logic
│   │   └── ReportCtrl.js       # Dashboard calculations & chart rendering
│   └── services/
│       └── ExpenseService.js    # Data layer — CRUD operations & localStorage
└── views/
    ├── dashboard.html           # Dashboard & budget manager partial
    ├── add-expense.html         # Add / edit expense form partial
    └── view-expenses.html       # Expense history & filter partial
```

---

## ⚡ Getting Started

This is a static web app — no build tools or package manager required.

**Option 1 — Live Server (VS Code)**
1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension
2. Right-click `index.html` → **Open with Live Server**

**Option 2 — Any HTTP server**
```bash
# Python
python -m http.server 8080

# Node.js (npx)
npx serve .
```

Then open `http://localhost:8080` in your browser.

> ⚠️ Must be served over HTTP — opening `index.html` directly as a `file://` URL will break AngularJS routing.

---

## 📌 Notes

- Data is stored in `localStorage` under the keys `expense_tracker_expenses` and `expense_tracker_budgets`
- Seed data is automatically loaded on first run so the dashboard looks populated right away
- The app uses AngularJS hashbang routing (`#!/`), so all navigation stays within `index.html`

---

*Vibecoded  using Antigravity AI*
