/**
 * ReportCtrl.js — Controller for the Dashboard page
 *
 * This controller handles all the calculations shown on the dashboard:
 *   - Total money spent
 *   - Number of transactions
 *   - Highest spending category
 *   - Per-category totals (for budget bars and the pie chart)
 *
 * CONCEPT: $timeout
 * Chart.js needs the <canvas> element to exist in the DOM before it
 * can draw on it. $timeout delays our chart code by 100ms, giving
 * AngularJS time to finish rendering the HTML first.
 */
app.controller('ReportCtrl', function($scope, $timeout, ExpenseService) {

  // ── Scope Variables ───────────────────────────────────────────

  $scope.categories      = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Other'];
  $scope.totalSpent      = 0;
  $scope.totalTransactions = 0;
  $scope.highestCategory = 'None';
  $scope.categoryTotals  = {};   // e.g. { Food: 85.50, Transport: 45.00, ... }
  $scope.budgets         = {};   // e.g. { Food: 200, Transport: 100, ... }


  // ── Step 1: Calculate Summary Numbers ────────────────────────

  var expenses = ExpenseService.getExpenses();

  $scope.totalSpent        = ExpenseService.getTotalSpent();
  $scope.totalTransactions = expenses.length;
  $scope.budgets           = ExpenseService.getBudgets();

  // Initialise every category total to zero
  $scope.categories.forEach(function(category) {
    $scope.categoryTotals[category] = 0;
  });

  // Loop through all expenses and add each amount to its category
  expenses.forEach(function(expense) {
    if ($scope.categoryTotals[expense.category] !== undefined) {
      $scope.categoryTotals[expense.category] += expense.amount;
    }
  });

  // Find which category has the highest spending
  var maxAmount = 0;
  $scope.categories.forEach(function(category) {
    if ($scope.categoryTotals[category] > maxAmount) {
      maxAmount = $scope.categoryTotals[category];
      $scope.highestCategory = category;
    }
  });

  if (maxAmount === 0) {
    $scope.highestCategory = 'None';
  }


  // ── Step 2: Budget Helper Functions ──────────────────────────

  /**
   * Returns true if spending in this category is over the set budget.
   * Used in the HTML with ng-class to turn the progress bar red.
   */
  $scope.isBudgetExceeded = function(category) {
    var spent  = $scope.categoryTotals[category] || 0;
    var budget = $scope.budgets[category] || 0;
    return spent > budget;
  };

  /**
   * Returns what percentage of the budget has been spent (max 100%).
   * Used to set the width of the Bootstrap progress bar.
   *
   * CONCEPT: AngularJS filter in controller
   * The HTML uses | currency and | date filters. Here we do the
   * percentage maths ourselves and return a plain number.
   */
  $scope.getBudgetPercentage = function(category) {
    var budget = $scope.budgets[category] || 0;
    if (budget <= 0) return 0;
    var spent   = $scope.categoryTotals[category] || 0;
    var percent = (spent / budget) * 100;
    return Math.min(100, Math.round(percent));
  };

  /**
   * Returns how much budget is left (can be negative if exceeded).
   * The HTML uses the | currency filter to format this as $0.00.
   */
  $scope.getRemainingBudget = function(category) {
    var budget = $scope.budgets[category] || 0;
    var spent  = $scope.categoryTotals[category] || 0;
    return budget - spent;
  };

  /**
   * Called when the user types a new budget amount.
   * ng-change in the HTML triggers this automatically.
   */
  $scope.updateBudget = function() {
    ExpenseService.saveBudgets($scope.budgets);
  };


  // ── Step 3: Draw the Pie Chart ────────────────────────────────

  /**
   * CONCEPT: $timeout
   * We wait 100ms before running Chart.js so that AngularJS has
   * finished rendering the <canvas> element in the DOM.
   */
  $timeout(function() {

    var canvas = document.getElementById('categoryPieChart');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');

    // Build data arrays from our categoryTotals object
    var chartLabels = $scope.categories;
    var chartData   = $scope.categories.map(function(cat) {
      return $scope.categoryTotals[cat];
    });

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: chartLabels,
        datasets: [{
          data:            chartData,
          backgroundColor: ['#f59e0b', '#3b82f6', '#a855f7', '#06b6d4', '#ec4899', '#64748b'],
          borderColor:     '#ffffff',
          borderWidth:     2
        }]
      },
      options: {
        responsive:          true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });

  }, 100);

});
