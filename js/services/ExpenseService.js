/**
 * ExpenseService
 * 
 * A service that manages the storage of expenses and category budgets in localStorage.
 * It provides functions to add, edit, update, delete expenses, and track category budgets.
 */
app.service('ExpenseService', function() {
  // Key names for localStorage
  var EXPENSES_STORAGE_KEY = 'expense_tracker_expenses';
  var BUDGETS_STORAGE_KEY = 'expense_tracker_budgets';

  // Holds the expense object that is currently selected for editing across views
  this.activeEditExpense = null;

  // Load expenses from localStorage or initialize with seed data if empty
  var expenses = [];
  var storedExpenses = localStorage.getItem(EXPENSES_STORAGE_KEY);
  
  if (storedExpenses) {
    expenses = JSON.parse(storedExpenses);
    // Convert date strings back to JavaScript Date objects for form handling
    expenses.forEach(function(item) {
      if (item.date) {
        item.date = new Date(item.date);
      }
    });
  } else {
    // Seed data: helps students present the app instantly with visual charts
    var today = new Date();
    var yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    var lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 5);

    expenses = [
      { id: 1, description: 'Groceries at Walmart', amount: 85.50, category: 'Food', date: yesterday },
      { id: 2, description: 'Gas Station fill up', amount: 45.00, category: 'Transport', date: today },
      { id: 3, description: 'Electric Bill', amount: 150.00, category: 'Utilities', date: lastWeek },
      { id: 4, description: 'Movie Tickets', amount: 30.00, category: 'Entertainment', date: yesterday },
      { id: 5, description: 'New Running Shoes', amount: 120.00, category: 'Shopping', date: lastWeek }
    ];
    // Save these seed expenses to storage
    localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses));
  }

  // Load budgets from localStorage or initialize with defaults if empty
  var budgets = {};
  var storedBudgets = localStorage.getItem(BUDGETS_STORAGE_KEY);
  
  if (storedBudgets) {
    budgets = JSON.parse(storedBudgets);
  } else {
    // Seed budgets for each default category
    budgets = {
      'Food': 200,
      'Transport': 100,
      'Entertainment': 150,
      'Utilities': 250,
      'Shopping': 200,
      'Other': 100
    };
    localStorage.setItem(BUDGETS_STORAGE_KEY, JSON.stringify(budgets));
  }

  /**
   * Save the current expenses array to localStorage.
   */
  var saveExpensesToStorage = function() {
    localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses));
  };

  /**
   * Get all expenses.
   * @returns {Array} List of all expenses.
   */
  this.getExpenses = function() {
    return expenses;
  };

  /**
   * Add a new expense.
   * @param {Object} expense - The expense object (description, amount, category, date).
   */
  this.addExpense = function(expense) {
    // Assign a unique ID using the current timestamp
    expense.id = Date.now();
    // Ensure amount is float/number type
    expense.amount = parseFloat(expense.amount);
    
    // Add to the runtime array and persist
    expenses.push(expense);
    saveExpensesToStorage();
  };

  /**
   * Update an existing expense.
   * @param {Object} updatedExpense - The updated expense object with an existing ID.
   */
  this.updateExpense = function(updatedExpense) {
    // Search the array for the expense with the matching ID
    for (var i = 0; i < expenses.length; i++) {
      if (expenses[i].id === updatedExpense.id) {
        expenses[i] = updatedExpense;
        expenses[i].amount = parseFloat(updatedExpense.amount);
        break;
      }
    }
    saveExpensesToStorage();
  };

  /**
   * Delete an expense by ID.
   * @param {number} id - The unique ID of the expense to delete.
   */
  this.deleteExpense = function(id) {
    // Find and splice out the expense that matches the provided ID.
    // We mutate in-place (splice) instead of reassigning (filter) so that
    // controllers which hold a direct reference to this array stay in sync.
    for (var i = 0; i < expenses.length; i++) {
      if (expenses[i].id === id) {
        expenses.splice(i, 1);
        break;
      }
    }
    saveExpensesToStorage();
  };

  /**
   * Calculate the total spent across all expenses.
   * @returns {number} The sum of all expense amounts.
   */
  this.getTotalSpent = function() {
    var total = 0;
    for (var i = 0; i < expenses.length; i++) {
      total += expenses[i].amount;
    }
    return total;
  };

  /**
   * Get category budgets object.
   * @returns {Object} Key-value pairs of category names and budget limits.
   */
  this.getBudgets = function() {
    return budgets;
  };

  /**
   * Save category budgets to storage.
   * @param {Object} newBudgets - The updated budgets object.
   */
  this.saveBudgets = function(newBudgets) {
    budgets = newBudgets;
    localStorage.setItem(BUDGETS_STORAGE_KEY, JSON.stringify(budgets));
  };
});
