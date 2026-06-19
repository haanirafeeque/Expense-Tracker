// ExpenseCtrl — handles the Add Expense form and the View Expenses list
app.controller('ExpenseCtrl', function($scope, $location, ExpenseService) {

  $scope.categories  = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Other'];
  $scope.expenses    = ExpenseService.getExpenses();
  $scope.isEditing   = false;
  $scope.searchQuery = {};

  // If the user clicked Edit, pre-fill the form; otherwise start blank
  if (ExpenseService.activeEditExpense !== null) {
    $scope.expenseForm = angular.copy(ExpenseService.activeEditExpense);
    $scope.expenseForm.date = new Date($scope.expenseForm.date);
    $scope.isEditing = true;
  } else {
    $scope.expenseForm = { description: '', amount: null, category: '', date: new Date() };
  }

  // Save a new expense and go to the list
  $scope.addExpense = function() {
    if (!$scope.expenseForm.description || !$scope.expenseForm.amount ||
        !$scope.expenseForm.category    || !$scope.expenseForm.date   ||
        $scope.expenseForm.amount <= 0) { return; }

    ExpenseService.addExpense(angular.copy($scope.expenseForm));
    $scope.resetForm();
    $location.path('/view-expenses');
  };

  // Save edits to an existing expense and go to the list
  $scope.updateExpense = function() {
    if (!$scope.expenseForm.description || !$scope.expenseForm.amount ||
        !$scope.expenseForm.category    || !$scope.expenseForm.date   ||
        $scope.expenseForm.amount <= 0) { return; }

    ExpenseService.updateExpense(angular.copy($scope.expenseForm));
    ExpenseService.activeEditExpense = null;
    $location.path('/view-expenses');
  };

  // Store the selected expense and navigate to the edit form
  $scope.editExpense = function(expense) {
    ExpenseService.activeEditExpense = expense;
    $location.path('/add-expense');
  };

  // Delete an expense after confirmation
  $scope.deleteExpense = function(id) {
    if (confirm('Delete this expense?')) {
      ExpenseService.deleteExpense(id);
    }
  };

  // Clear the form back to blank
  $scope.resetForm = function() {
    $scope.expenseForm = { description: '', amount: null, category: '', date: new Date() };
    ExpenseService.activeEditExpense = null;
    $scope.isEditing = false;
  };

});
