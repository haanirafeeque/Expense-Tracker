/**
 * ReportCtrl
 * 
 * Handles the dashboard analytics, category summary calculations,
 * category budgets, and renders the Chart.js Pie Chart.
 */
app.controller('ReportCtrl', ['$scope', '$timeout', 'ExpenseService', function($scope, $timeout, ExpenseService) {
  
  // Define active category list
  $scope.categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Other'];
  
  // Variables to hold calculations
  $scope.totalSpent = 0;
  $scope.totalTransactions = 0;
  $scope.highestCategory = 'None';
  $scope.categoryTotals = {};
  $scope.budgets = {};

  // Holds reference to the Chart.js instance to destroy it on reload
  var categoryChart = null;

  /**
   * Run calculations and load data from ExpenseService.
   */
  $scope.calculateDashboard = function() {
    var expenses = ExpenseService.getExpenses();
    $scope.totalSpent = ExpenseService.getTotalSpent();
    $scope.totalTransactions = expenses.length;
    $scope.budgets = ExpenseService.getBudgets();

    // 1. Reset category totals to 0
    $scope.categories.forEach(function(category) {
      $scope.categoryTotals[category] = 0;
    });

    // 2. Loop through all expenses and sum them up by category
    expenses.forEach(function(expense) {
      if ($scope.categoryTotals[expense.category] !== undefined) {
        $scope.categoryTotals[expense.category] += expense.amount;
      }
    });

    // 3. Find the category with the highest spending
    var maxAmount = 0;
    var highest = 'None';
    $scope.categories.forEach(function(category) {
      var amount = $scope.categoryTotals[category];
      if (amount > maxAmount) {
        maxAmount = amount;
        highest = category;
      }
    });
    
    // Set to 'None' if no spending has occurred
    $scope.highestCategory = maxAmount > 0 ? highest : 'None';
  };

  /**
   * Saves the budget for a specific category.
   * Triggered on user input change.
   */
  $scope.updateBudget = function() {
    // Save updated budget list back to service
    ExpenseService.saveBudgets($scope.budgets);
  };

  /**
   * Check if spending in a category exceeds its assigned budget.
   * @param {string} category - The category to check.
   * @returns {boolean} True if budget exceeded, false otherwise.
   */
  $scope.isBudgetExceeded = function(category) {
    var spent = $scope.categoryTotals[category] || 0;
    var budget = $scope.budgets[category] || 0;
    return spent > budget;
  };

  /**
   * Calculates the percentage of budget spent (capped at 100%).
   * @param {string} category - The category name.
   * @returns {number} The spent percentage (0 to 100).
   */
  $scope.getBudgetPercentage = function(category) {
    var budget = $scope.budgets[category] || 0;
    if (budget <= 0) return 0;
    var spent = $scope.categoryTotals[category] || 0;
    var percent = (spent / budget) * 100;
    return Math.min(100, Math.round(percent));
  };

  /**
   * Calculates the remaining budget for a category.
   * @param {string} category - The category name.
   * @returns {number} The remaining amount (can be negative if exceeded).
   */
  $scope.getRemainingBudget = function(category) {
    var budget = $scope.budgets[category] || 0;
    var spent = $scope.categoryTotals[category] || 0;
    return budget - spent;
  };

  /**
   * Initialize or update the Chart.js Pie Chart.
   */
  $scope.renderChart = function() {
    // Wait for AngularJS compilation to complete and canvas to mount in DOM
    $timeout(function() {
      var canvas = document.getElementById('categoryPieChart');
      if (!canvas) return;

      var ctx = canvas.getContext('2d');
      
      // If a chart already exists, destroy it before creating a new one to prevent overlay bugs
      if (categoryChart !== null) {
        categoryChart.destroy();
      }

      // Collect data arrays for chart input
      var chartData = [];
      $scope.categories.forEach(function(category) {
        chartData.push($scope.categoryTotals[category]);
      });

      // Colors matching our badges
      var chartColors = [
        '#f59e0b', // Food - Amber
        '#3b82f6', // Transport - Blue
        '#a855f7', // Entertainment - Purple
        '#06b6d4', // Utilities - Cyan
        '#ec4899', // Shopping - Pink
        '#64748b'  // Other - Slate
      ];

      // Create new Pie Chart instance
      categoryChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: $scope.categories,
          datasets: [{
            data: chartData,
            backgroundColor: chartColors,
            borderColor: '#ffffff',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: {
                  family: "'Inter', sans-serif",
                  size: 12
                },
                padding: 15
              }
            }
          }
        }
      });
    }, 100);
  };

  /**
   * Controller Entry Point
   */
  $scope.init = function() {
    $scope.calculateDashboard();
    $scope.renderChart();
  };

  // Run initial calculations and render
  $scope.init();
}]);
