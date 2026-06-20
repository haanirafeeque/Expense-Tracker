// CONTROLLER: used by both add-expense.html and view-expenses.html
app.controller('ExpenseCtrl', function($scope, $location, ExpenseService) {

  $scope.categories  = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Other'];
  $scope.expenses    = ExpenseService.getExpenses(); // live reference — updates automatically
  $scope.searchQuery = {};   // bound to filter inputs in view-expenses.html
  $scope.isEditing   = false;

  // Pre-fill the form if editing, otherwise start blank
  if (ExpenseService.activeEditExpense) {
    $scope.expenseForm      = angular.copy(ExpenseService.activeEditExpense); // copy so changes don't affect the table
    $scope.expenseForm.date = new Date($scope.expenseForm.date);
    $scope.isEditing        = true;
  } else {
    $scope.expenseForm = { description: '', amount: null, category: '', date: new Date() };
  }

  $scope.addExpense = function() {
    if (!$scope.expenseForm.description || !$scope.expenseForm.amount ||
        !$scope.expenseForm.category    || $scope.expenseForm.amount <= 0) { return; }
    ExpenseService.addExpense(angular.copy($scope.expenseForm));
    $scope.resetForm();
    $location.path('/view-expenses');
  };

  $scope.updateExpense = function() {
    if (!$scope.expenseForm.description || !$scope.expenseForm.amount ||
        !$scope.expenseForm.category    || $scope.expenseForm.amount <= 0) { return; }
    ExpenseService.updateExpense(angular.copy($scope.expenseForm));
    ExpenseService.activeEditExpense = null;
    $location.path('/view-expenses');
  };

  $scope.editExpense = function(expense) {
    ExpenseService.activeEditExpense = expense; // store it so the form can read it
    $location.path('/add-expense');
  };

  $scope.deleteExpense = function(id) {
    if (confirm('Delete this expense?')) { ExpenseService.deleteExpense(id); }
  };

  $scope.resetForm = function() {
    $scope.expenseForm = { description: '', amount: null, category: '', date: new Date() };
    ExpenseService.activeEditExpense = null;
    $scope.isEditing = false;
  };

});
