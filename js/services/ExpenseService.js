// ExpenseService — handles all data storage and retrieval
app.service('ExpenseService', function() {

  var EXPENSES_KEY = 'expense_tracker_expenses';
  var BUDGETS_KEY  = 'expense_tracker_budgets';

  // Load expenses from localStorage, or use sample data on first run
  var expenses = [];
  var saved = localStorage.getItem(EXPENSES_KEY);

  if (saved) {
    expenses = JSON.parse(saved);
    // Convert date strings back to Date objects
    expenses.forEach(function(e) { e.date = new Date(e.date); });
  } else {
    var today    = new Date();
    var yday     = new Date(); yday.setDate(today.getDate() - 1);
    var lastWeek = new Date(); lastWeek.setDate(today.getDate() - 5);

    expenses = [
      { id: 1, description: 'Groceries at Walmart', amount: 85.50,  category: 'Food',          date: yday     },
      { id: 2, description: 'Gas Station fill up',  amount: 45.00,  category: 'Transport',     date: today    },
      { id: 3, description: 'Electric Bill',        amount: 150.00, category: 'Utilities',     date: lastWeek },
      { id: 4, description: 'Movie Tickets',        amount: 30.00,  category: 'Entertainment', date: yday     },
      { id: 5, description: 'New Running Shoes',    amount: 120.00, category: 'Shopping',      date: lastWeek }
    ];
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  }

  // Load budgets from localStorage, or use defaults
  var budgets = {};
  var savedBudgets = localStorage.getItem(BUDGETS_KEY);

  if (savedBudgets) {
    budgets = JSON.parse(savedBudgets);
  } else {
    budgets = { Food: 200, Transport: 100, Entertainment: 150, Utilities: 250, Shopping: 200, Other: 100 };
    localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
  }

  // Save expenses array to localStorage
  function save() {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  }

  // Used to pass an expense from the list page to the edit form
  this.activeEditExpense = null;

  // Return all expenses
  this.getExpenses = function() {
    return expenses;
  };

  // Add a new expense
  this.addExpense = function(expense) {
    expense.id     = Date.now();
    expense.amount = parseFloat(expense.amount);
    expenses.push(expense);
    save();
  };

  // Replace an existing expense with updated data
  this.updateExpense = function(updated) {
    for (var i = 0; i < expenses.length; i++) {
      if (expenses[i].id === updated.id) {
        expenses[i]        = updated;
        expenses[i].amount = parseFloat(updated.amount);
        break;
      }
    }
    save();
  };

  // Remove an expense by ID
  this.deleteExpense = function(id) {
    for (var i = 0; i < expenses.length; i++) {
      if (expenses[i].id === id) {
        expenses.splice(i, 1);
        break;
      }
    }
    save();
  };

  // Return the sum of all expense amounts
  this.getTotalSpent = function() {
    var total = 0;
    expenses.forEach(function(e) { total += e.amount; });
    return total;
  };

  // Return the budgets object
  this.getBudgets = function() { return budgets; };

  // Save updated budgets
  this.saveBudgets = function(newBudgets) {
    budgets = newBudgets;
    localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
  };

});
