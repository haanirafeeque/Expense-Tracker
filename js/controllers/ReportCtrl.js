app.controller('ReportCtrl', function($scope, $timeout, ExpenseService) {

  $scope.categories      = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Other'];
  $scope.categoryTotals  = {};
  $scope.budgets         = ExpenseService.getBudgets();
  $scope.totalSpent      = ExpenseService.getTotalSpent();
  $scope.highestCategory = 'None';

  var expenses = ExpenseService.getExpenses();
  $scope.totalTransactions = expenses.length;

  // Set all category totals to 0
  for (var i = 0; i < $scope.categories.length; i++) {
    $scope.categoryTotals[$scope.categories[i]] = 0;
  }

  // Add each expense amount to its category total
  for (var j = 0; j < expenses.length; j++) {
    var cat = expenses[j].category;
    if ($scope.categoryTotals[cat] !== undefined) {
      $scope.categoryTotals[cat] = $scope.categoryTotals[cat] + expenses[j].amount;
    }
  }

  // Find the category with the most spending
  var max = 0;
  for (var k = 0; k < $scope.categories.length; k++) {
    if ($scope.categoryTotals[$scope.categories[k]] > max) {
      max = $scope.categoryTotals[$scope.categories[k]];
      $scope.highestCategory = $scope.categories[k];
    }
  }

  $scope.isBudgetExceeded = function(cat) {
    return $scope.categoryTotals[cat] > $scope.budgets[cat];
  };

  $scope.getBudgetPercentage = function(cat) {
    if (!$scope.budgets[cat]) return 0;
    var percent = ($scope.categoryTotals[cat] / $scope.budgets[cat]) * 100;
    return Math.min(100, Math.round(percent));
  };

  $scope.getRemainingBudget = function(cat) {
    return $scope.budgets[cat] - $scope.categoryTotals[cat];
  };

  $scope.updateBudget = function() {
    ExpenseService.saveBudgets($scope.budgets);
  };

  // Draw the pie chart after the page finishes loading
  $timeout(function() {
    var canvas = document.getElementById('categoryPieChart');
    if (!canvas) return;

    var data = [];
    for (var i = 0; i < $scope.categories.length; i++) {
      data.push($scope.categoryTotals[$scope.categories[i]]);
    }

    new Chart(canvas.getContext('2d'), {
      type: 'pie',
      data: {
        labels: $scope.categories,
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
