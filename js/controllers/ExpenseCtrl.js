// This controller handles two pages: add-expense.html and view-expenses.html
// $scope  → the glue between this controller and the HTML (anything on $scope is usable in the HTML)
// $location → lets us change the current page URL
// ExpenseService → our data service (inject it by name to use it)
app.controller('ExpenseCtrl', function($scope, $location, ExpenseService) {

  $scope.categories  = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Other'];
  $scope.expenses    = ExpenseService.getExpenses(); // Load all expenses into the scope
  $scope.searchQuery = {}; // Bound to the search/filter fields in view-expenses.html
  $scope.isEditing   = false; // Controls whether the form shows "Add" or "Edit" mode

  // --- DECIDE: ADD MODE or EDIT MODE? ---
  // If the user clicked "Edit" on an expense, activeEditExpense will not be null.
  // In that case, pre-fill the form with that expense's data.
  if (ExpenseService.activeEditExpense) {
    // angular.copy() makes a copy so edits don't change the table until the user saves
    $scope.expenseForm      = angular.copy(ExpenseService.activeEditExpense);
    $scope.expenseForm.date = new Date($scope.expenseForm.date); // Convert string back to Date
    $scope.isEditing        = true;
  } else {
    // Start with a blank form, pre-fill the date with today
    $scope.expenseForm = { description: '', amount: null, category: '', date: new Date() };
  }

  // --- ADD EXPENSE ---
  // Called when the user clicks "Save Expense" in add mode
  $scope.addExpense = function() {
    // Basic validation: stop if any required field is missing or amount is 0 or less
    if (!$scope.expenseForm.description || !$scope.expenseForm.amount ||
        !$scope.expenseForm.category    || $scope.expenseForm.amount <= 0) { return; }

    ExpenseService.addExpense(angular.copy($scope.expenseForm)); // Save to service
    $scope.resetForm();                   // Clear the form
    $location.path('/view-expenses');     // Go to the expenses list page
  };

  // --- UPDATE EXPENSE ---
  // Called when the user clicks "Update Expense" in edit mode
  $scope.updateExpense = function() {
    if (!$scope.expenseForm.description || !$scope.expenseForm.amount ||
        !$scope.expenseForm.category    || $scope.expenseForm.amount <= 0) { return; }

    ExpenseService.updateExpense(angular.copy($scope.expenseForm)); // Save changes
    ExpenseService.activeEditExpense = null; // Clear the edit state
    $location.path('/view-expenses');
  };

  // --- EDIT EXPENSE ---
  // Called when the user clicks the Edit button on a row in the table
  $scope.editExpense = function(expense) {
    ExpenseService.activeEditExpense = expense; // Store which expense to edit
    $location.path('/add-expense');             // Go to the form (it will load in edit mode)
  };

  // --- DELETE EXPENSE ---
  // Called when the user clicks the Delete button on a row
  $scope.deleteExpense = function(id) {
    if (confirm('Delete this expense?')) {  // Show a confirmation dialog first
      ExpenseService.deleteExpense(id);     // Remove from the service (table updates automatically)
    }
  };

  // --- RESET FORM ---
  // Clears all form fields back to blank
  $scope.resetForm = function() {
    $scope.expenseForm = { description: '', amount: null, category: '', date: new Date() };
    ExpenseService.activeEditExpense = null;
    $scope.isEditing = false;
  };

});
