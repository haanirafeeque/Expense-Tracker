// This controller powers the Dashboard page (dashboard.html)
// It calculates spending totals, checks budgets, and draws the pie chart.
// $timeout is used to delay the chart until the HTML has fully loaded.
app.controller('ReportCtrl', function($scope, $timeout, ExpenseService) {

  // --- SCOPE VARIABLES (available in the HTML) ---
  $scope.categories        = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Other'];
  $scope.categoryTotals    = {}; // Stores total spent per category e.g. { Food: 85.50, ... }
  $scope.budgets           = ExpenseService.getBudgets();    // Budget limits per category
  $scope.totalSpent        = ExpenseService.getTotalSpent(); // Grand total of all expenses
  $scope.highestCategory   = 'None'; // Category with the most spending
  $scope.totalTransactions = 0;

  var expenses = ExpenseService.getExpenses(); // Get all expenses from the service
  $scope.totalTransactions = expenses.length;  // Count how many expenses exist

  // --- STEP 1: Calculate total spent per category ---
  // First set every category to 0
  for (var i = 0; i < $scope.categories.length; i++) {
    $scope.categoryTotals[$scope.categories[i]] = 0;
  }

  // Then loop through every expense and add its amount to the right category
  for (var j = 0; j < expenses.length; j++) {
    var cat = expenses[j].category;
    if ($scope.categoryTotals[cat] !== undefined) {
      $scope.categoryTotals[cat] = $scope.categoryTotals[cat] + expenses[j].amount;
    }
  }

  // --- STEP 2: Find the highest spending category ---
  var max = 0;
  for (var k = 0; k < $scope.categories.length; k++) {
    var catName = $scope.categories[k];
    if ($scope.categoryTotals[catName] > max) {
      max = $scope.categoryTotals[catName];
      $scope.highestCategory = catName;
    }
  }

  // --- BUDGET HELPER FUNCTIONS ---
  // These are called in the HTML using {{ }} and ng-class

  // Returns true if spending is over the budget for this category
  $scope.isBudgetExceeded = function(cat) {
    return $scope.categoryTotals[cat] > $scope.budgets[cat];
  };

  // Returns what % of the budget has been used (0 to 100)
  // Used to set the width of the progress bar in the HTML
  $scope.getBudgetPercentage = function(cat) {
    if (!$scope.budgets[cat]) return 0; // Avoid dividing by zero
    var percent = ($scope.categoryTotals[cat] / $scope.budgets[cat]) * 100;
    return Math.min(100, Math.round(percent)); // Cap at 100%
  };

  // Returns how much budget is left (negative = over budget)
  // The HTML uses the currency filter to display this as $0.00
  $scope.getRemainingBudget = function(cat) {
    return $scope.budgets[cat] - $scope.categoryTotals[cat];
  };

  // Called automatically when the user types in a budget input (ng-change)
  $scope.updateBudget = function() {
    ExpenseService.saveBudgets($scope.budgets);
  };

  // --- STEP 3: Draw the Pie Chart ---
  // $timeout waits 100ms so AngularJS finishes rendering the <canvas> in the HTML first.
  // Without this delay, document.getElementById('categoryPieChart') would return null.
  $timeout(function() {
    var canvas = document.getElementById('categoryPieChart');
    if (!canvas) return; // Exit if the canvas element doesn't exist

    // Build the data array for Chart.js in the same order as $scope.categories
    var data = [];
    for (var i = 0; i < $scope.categories.length; i++) {
      data.push($scope.categoryTotals[$scope.categories[i]]);
    }

    // Create the pie chart using Chart.js
    new Chart(canvas.getContext('2d'), {
      type: 'pie',
      data: {
        labels: $scope.categories, // Category names shown in the legend
        datasets: [{
          data: data,
          backgroundColor: ['#f59e0b', '#3b82f6', '#a855f7', '#06b6d4', '#ec4899', '#64748b'],
          borderColor: '#ffffff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });

  }, 100);

});
