/**
 * ExpenseService.js — Data Management Service
 *
 * CONCEPT: app.service()
 * A service is a singleton object shared across controllers.
 * Instead of each controller managing its own data, we put all
 * data logic here in one place. Controllers ask the service for
 * data using dependency injection.
 *
 * Why a service?
 *   - Data is shared between controllers (e.g. adding an expense
 *     in ExpenseCtrl makes it visible in ReportCtrl)
 *   - One place to update if logic changes
 */
app.service('ExpenseService', function() {

  // ── Storage Keys ──────────────────────────────────────────────
  var EXPENSES_KEY = 'expense_tracker_expenses';
  var BUDGETS_KEY  = 'expense_tracker_budgets';

  // ── Load data from localStorage (or use seed data on first run) ──

  var expenses = [];

  var saved = localStorage.getItem(EXPENSES_KEY);
  if (saved) {
    // Parse the JSON string back into a JavaScript array
    expenses = JSON.parse(saved);

    // Dates are saved as strings in JSON — convert them back to Date objects
    expenses.forEach(function(expense) {
      expense.date = new Date(expense.date);
    });

  } else {
    // First time running the app — load some sample data
    var today     = new Date();
    var yesterday = new Date(); yesterday.setDate(today.getDate() - 1);
    var lastWeek  = new Date(); lastWeek.setDate(today.getDate() - 5);

    expenses = [
      { id: 1, description: 'Groceries at Walmart', amount: 85.50,  category: 'Food',          date: yesterday },
      { id: 2, description: 'Gas Station fill up',  amount: 45.00,  category: 'Transport',     date: today     },
      { id: 3, description: 'Electric Bill',        amount: 150.00, category: 'Utilities',     date: lastWeek  },
      { id: 4, description: 'Movie Tickets',        amount: 30.00,  category: 'Entertainment', date: yesterday },
      { id: 5, description: 'New Running Shoes',    amount: 120.00, category: 'Shopping',      date: lastWeek  }
    ];

    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  }

  // ── Budget limits per category ────────────────────────────────

  var budgets = {};

  var savedBudgets = localStorage.getItem(BUDGETS_KEY);
  if (savedBudgets) {
    budgets = JSON.parse(savedBudgets);
  } else {
    budgets = {
      'Food':          200,
      'Transport':     100,
      'Entertainment': 150,
      'Utilities':     250,
      'Shopping':      200,
      'Other':         100
    };
    localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
  }

  // ── Helper: save expenses array to localStorage ───────────────
  function saveExpenses() {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  }

  // ── This variable lets ExpenseCtrl pass an expense to edit ────
  // When the user clicks "Edit" we store the expense here,
  // then the add-expense form reads it on load.
  this.activeEditExpense = null;


  // ── Public Methods (called by controllers) ────────────────────

  /**
   * Return the full list of expenses.
   * Controllers bind $scope.expenses to this array directly,
   * so any changes here automatically update the view.
   */
  this.getExpenses = function() {
    return expenses;
  };

  /**
   * Add a new expense to the list and save it.
   */
  this.addExpense = function(expense) {
    expense.id     = Date.now();             // Unique ID using timestamp
    expense.amount = parseFloat(expense.amount);
    expenses.push(expense);
    saveExpenses();
  };

  /**
   * Find an expense by ID and replace it with the updated version.
   */
  this.updateExpense = function(updatedExpense) {
    for (var i = 0; i < expenses.length; i++) {
      if (expenses[i].id === updatedExpense.id) {
        expenses[i]        = updatedExpense;
        expenses[i].amount = parseFloat(updatedExpense.amount);
        break;
      }
    }
    saveExpenses();
  };

  /**
   * Remove an expense from the list by its ID.
   * We use splice() to remove in-place so controllers holding
   * a reference to this array see the change immediately.
   */
  this.deleteExpense = function(id) {
    for (var i = 0; i < expenses.length; i++) {
      if (expenses[i].id === id) {
        expenses.splice(i, 1);
        break;
      }
    }
    saveExpenses();
  };

  /**
   * Add up all expense amounts and return the total.
   */
  this.getTotalSpent = function() {
    var total = 0;
    for (var i = 0; i < expenses.length; i++) {
      total += expenses[i].amount;
    }
    return total;
  };

  /**
   * Return the budget limits object.
   */
  this.getBudgets = function() {
    return budgets;
  };

  /**
   * Save updated budget limits.
   */
  this.saveBudgets = function(newBudgets) {
    budgets = newBudgets;
    localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
  };

});
