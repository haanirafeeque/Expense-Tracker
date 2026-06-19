/**
 * ExpenseCtrl.js — Controller for Add Expense & View Expenses pages
 *
 * CONCEPT: app.controller()
 * A controller connects the View (HTML) and the Service (data).
 * $scope is the "glue" — any variable or function put on $scope
 * becomes available inside the HTML template using {{ }} or ng-*.
 *
 * Dependency Injection: AngularJS reads the parameter names
 * ($scope, $location, ExpenseService) and automatically provides
 * the right objects — we never create them manually.
 */
app.controller('ExpenseCtrl', function($scope, $location, ExpenseService) {

  // ── Scope Variables ───────────────────────────────────────────

  // The list of all expense categories shown in the dropdown
  $scope.categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Other'];

  // The expenses array — bound directly to the service's array.
  // When the service adds/deletes items, this updates automatically.
  $scope.expenses = ExpenseService.getExpenses();

  // Tracks whether the form is in "Edit" or "Add" mode
  $scope.isEditing = false;

  // The object bound to the form fields using ng-model
  $scope.expenseForm = {};

  // Object used by ng-repeat filter in view-expenses.html
  // { description: '...', category: '...' } — matches both fields at once
  $scope.searchQuery = {};


  // ── Form Initialisation ───────────────────────────────────────

  // Check if the user clicked "Edit" on an expense.
  // If yes, pre-fill the form; if no, start with a blank form.
  if (ExpenseService.activeEditExpense !== null) {

    // CONCEPT: angular.copy()
    // We copy the object so edits in the form don't instantly change
    // the table — the change only saves when the user clicks Update.
    $scope.expenseForm = angular.copy(ExpenseService.activeEditExpense);
    $scope.expenseForm.date = new Date($scope.expenseForm.date);
    $scope.isEditing = true;

  } else {

    // Blank form with today's date pre-filled
    $scope.expenseForm = {
      description: '',
      amount:      null,
      category:    '',
      date:        new Date()
    };
    $scope.isEditing = false;

  }


  // ── Form Actions ──────────────────────────────────────────────

  /**
   * Called when the user submits the Add Expense form.
   *
   * CONCEPT: Form Validation
   * The HTML form uses 'required', 'min', etc. attributes.
   * We also do a manual check here as a second layer of safety.
   */
  $scope.addExpense = function() {

    // Manual validation — stop if any required field is empty
    if (!$scope.expenseForm.description ||
        !$scope.expenseForm.amount      ||
        !$scope.expenseForm.category    ||
        !$scope.expenseForm.date) {
      return;
    }

    if ($scope.expenseForm.amount <= 0) {
      return;
    }

    // Send a copy to the service so the form object stays clean
    ExpenseService.addExpense(angular.copy($scope.expenseForm));

    // Reset the form and go to the expense list
    $scope.resetForm();
    $location.path('/view-expenses');
  };

  /**
   * Called when the user submits the Edit Expense form.
   */
  $scope.updateExpense = function() {

    if (!$scope.expenseForm.description ||
        !$scope.expenseForm.amount      ||
        !$scope.expenseForm.category    ||
        !$scope.expenseForm.date) {
      return;
    }

    if ($scope.expenseForm.amount <= 0) {
      return;
    }

    ExpenseService.updateExpense(angular.copy($scope.expenseForm));

    // Clear the edit state and go back to the list
    ExpenseService.activeEditExpense = null;
    $scope.isEditing = false;
    $location.path('/view-expenses');
  };

  /**
   * Called when the user clicks the Edit button on an expense row.
   * Stores the selected expense in the service, then navigates to
   * the form page. The form reads activeEditExpense on load (above).
   */
  $scope.editExpense = function(expense) {
    ExpenseService.activeEditExpense = expense;
    $location.path('/add-expense');
  };

  /**
   * Delete an expense by its ID.
   * confirm() shows a browser dialog — if the user clicks OK it returns true.
   */
  $scope.deleteExpense = function(id) {
    if (confirm('Are you sure you want to delete this expense?')) {
      ExpenseService.deleteExpense(id);
      // No need to refresh — $scope.expenses is the same array reference,
      // and splice() already removed the item from it.
    }
  };

  /**
   * Reset the form back to blank fields.
   */
  $scope.resetForm = function() {
    $scope.expenseForm = {
      description: '',
      amount:      null,
      category:    '',
      date:        new Date()
    };
    ExpenseService.activeEditExpense = null;
    $scope.isEditing = false;
  };

});
