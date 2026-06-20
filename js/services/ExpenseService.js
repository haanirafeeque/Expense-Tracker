// A SERVICE stores and manages data that is shared between controllers.
// Instead of each controller having its own data, they all use this one service.
app.service('ExpenseService', function() {

  var expenses = []; // Array that holds all expense objects
  var budgets  = {}; // Object that holds budget limits per category

  // --- LOAD EXPENSES ---
  // Check if there is already saved data in the browser's localStorage.
  // localStorage stores data as a string, so we use JSON.parse to convert it back.
  if (localStorage.getItem('expenses')) {
    expenses = JSON.parse(localStorage.getItem('expenses'));

    // Dates are saved as text in localStorage, so convert them back to Date objects
    for (var i = 0; i < expenses.length; i++) {
      expenses[i].date = new Date(expenses[i].date);
    }

  } else {
    // No saved data found — use sample data so the app looks good on first run
    var today = new Date();
    var yday  = new Date();
    yday.setDate(today.getDate() - 1); // yesterday

    expenses = [
      { id: 1, description: 'Groceries',    amount: 85.50,  category: 'Food',          date: yday  },
      { id: 2, description: 'Gas Station',  amount: 45.00,  category: 'Transport',     date: today },
      { id: 3, description: 'Electric Bill',amount: 150.00, category: 'Utilities',     date: yday  },
      { id: 4, description: 'Movie Tickets',amount: 30.00,  category: 'Entertainment', date: yday  },
      { id: 5, description: 'Running Shoes',amount: 120.00, category: 'Shopping',      date: yday  }
    ];

    localStorage.setItem('expenses', JSON.stringify(expenses)); // Save the sample data
  }

  // --- LOAD BUDGETS ---
  if (localStorage.getItem('budgets')) {
    budgets = JSON.parse(localStorage.getItem('budgets'));
  } else {
    // Default budget limits per category
    budgets = { Food: 200, Transport: 100, Entertainment: 150, Utilities: 250, Shopping: 200, Other: 100 };
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }

  // Helper function: saves the expenses array to localStorage
  // Called after every add, update, or delete
  function save() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }

  // Used to pass an expense from the list page to the edit form.
  // When the user clicks "Edit", we store the expense here so the form can read it.
  this.activeEditExpense = null;

  // Return the full expenses array to the controller
  this.getExpenses = function() {
    return expenses;
  };

  // Add up all expense amounts and return the total
  this.getTotalSpent = function() {
    var total = 0;
    for (var i = 0; i < expenses.length; i++) {
      total = total + expenses[i].amount;
    }
    return total;
  };

  // Add a new expense to the array and save it
  this.addExpense = function(expense) {
    expense.id     = Date.now();             // Use the current timestamp as a unique ID
    expense.amount = parseFloat(expense.amount); // Make sure amount is a number
    expenses.push(expense);                  // Add to the array
    save();
  };

  // Find an expense by ID and replace it with the updated version
  this.updateExpense = function(updated) {
    for (var i = 0; i < expenses.length; i++) {
      if (expenses[i].id === updated.id) {   // Found the matching expense
        expenses[i]        = updated;
        expenses[i].amount = parseFloat(updated.amount);
        break;                               // Stop the loop once found
      }
    }
    save();
  };

  // Find an expense by ID and remove it from the array
  this.deleteExpense = function(id) {
    for (var i = 0; i < expenses.length; i++) {
      if (expenses[i].id === id) {
        expenses.splice(i, 1); // splice(i, 1) removes 1 item at position i
        break;
      }
    }
    save();
  };

  // Return the budgets object to the controller
  this.getBudgets = function() {
    return budgets;
  };

  // Save updated budgets (called when user changes a budget input on the dashboard)
  this.saveBudgets = function(newBudgets) {
    budgets = newBudgets;
    localStorage.setItem('budgets', JSON.stringify(budgets));
  };

});
