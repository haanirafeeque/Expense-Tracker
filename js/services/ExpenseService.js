app.service('ExpenseService', function() {

  var expenses = [];
  var budgets  = {};

  // Load from localStorage on startup
  if (localStorage.getItem('expenses')) {
    expenses = JSON.parse(localStorage.getItem('expenses'));
    for (var i = 0; i < expenses.length; i++) {
      expenses[i].date = new Date(expenses[i].date);
    }
  } else {
    var today = new Date();
    var yday  = new Date(); yday.setDate(today.getDate() - 1);
    expenses = [
      { id: 1, description: 'Groceries',    amount: 85.50,  category: 'Food',          date: yday  },
      { id: 2, description: 'Gas Station',  amount: 45.00,  category: 'Transport',     date: today },
      { id: 3, description: 'Electric Bill',amount: 150.00, category: 'Utilities',     date: yday  },
      { id: 4, description: 'Movie Tickets',amount: 30.00,  category: 'Entertainment', date: yday  },
      { id: 5, description: 'Running Shoes',amount: 120.00, category: 'Shopping',      date: yday  }
    ];
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }

  if (localStorage.getItem('budgets')) {
    budgets = JSON.parse(localStorage.getItem('budgets'));
  } else {
    budgets = { Food: 200, Transport: 100, Entertainment: 150, Utilities: 250, Shopping: 200, Other: 100 };
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }

  function save() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }

  this.activeEditExpense = null;

  this.getExpenses = function() { return expenses; };

  this.getTotalSpent = function() {
    var total = 0;
    for (var i = 0; i < expenses.length; i++) {
      total = total + expenses[i].amount;
    }
    return total;
  };

  this.addExpense = function(expense) {
    expense.id = Date.now();
    expense.amount = parseFloat(expense.amount);
    expenses.push(expense);
    save();
  };

  this.updateExpense = function(updated) {
    for (var i = 0; i < expenses.length; i++) {
      if (expenses[i].id === updated.id) {
        expenses[i] = updated;
        expenses[i].amount = parseFloat(updated.amount);
        break;
      }
    }
    save();
  };

  this.deleteExpense = function(id) {
    for (var i = 0; i < expenses.length; i++) {
      if (expenses[i].id === id) {
        expenses.splice(i, 1);
        break;
      }
    }
    save();
  };

  this.getBudgets  = function() { return budgets; };
  this.saveBudgets = function(b) {
    budgets = b;
    localStorage.setItem('budgets', JSON.stringify(budgets));
  };

});
