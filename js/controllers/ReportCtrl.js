// ReportCtrl — handles dashboard calculations and the pie chart
app.controller('ReportCtrl', function($scope, $timeout, ExpenseService) {

  $scope.categories        = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Other'];
  $scope.totalSpent        = 0;
  $scope.totalTransactions = 0;
  $scope.highestCategory   = 'None';
  $scope.categoryTotals    = {};
  $scope.budgets           = ExpenseService.getBudgets();

  var expenses = ExpenseService.getExpenses();

  // Calculate totals
  $scope.totalSpent        = ExpenseService.getTotalSpent();
  $scope.totalTransactions = expenses.length;

  // Reset every category to 0, then add each expense to its category
  $scope.categories.forEach(function(cat) { $scope.categoryTotals[cat] = 0; });
  expenses.forEach(function(e) {
    if ($scope.categoryTotals[e.category] !== undefined) {
      $scope.categoryTotals[e.category] += e.amount;
    }
  });

  // Find the highest spending category
  var max = 0;
  $scope.categories.forEach(function(cat) {
    if ($scope.categoryTotals[cat] > max) {
      max = $scope.categoryTotals[cat];
      $scope.highestCategory = cat;
    }
  });
  if (max === 0) $scope.highestCategory = 'None';

  // Budget helper functions (used in the HTML template)
  $scope.isBudgetExceeded = function(cat) {
    return ($scope.categoryTotals[cat] || 0) > ($scope.budgets[cat] || 0);
  };

  $scope.getBudgetPercentage = function(cat) {
    var budget = $scope.budgets[cat] || 0;
    if (budget <= 0) return 0;
    return Math.min(100, Math.round(($scope.categoryTotals[cat] / budget) * 100));
  };

  $scope.getRemainingBudget = function(cat) {
    return ($scope.budgets[cat] || 0) - ($scope.categoryTotals[cat] || 0);
  };

  $scope.updateBudget = function() {
    ExpenseService.saveBudgets($scope.budgets);
  };

  // Draw pie chart after AngularJS finishes rendering the <canvas> element
  $timeout(function() {
    var canvas = document.getElementById('categoryPieChart');
    if (!canvas) return;

    new Chart(canvas.getContext('2d'), {
      type: 'pie',
      data: {
        labels: $scope.categories,
        datasets: [{
          data:            $scope.categories.map(function(cat) { return $scope.categoryTotals[cat]; }),
          backgroundColor: ['#f59e0b', '#3b82f6', '#a855f7', '#06b6d4', '#ec4899', '#64748b'],
          borderColor:     '#ffffff',
          borderWidth:     2
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
