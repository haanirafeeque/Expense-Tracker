/**
 * ExpenseCtrl
 * 
 * Handles the logic for managing expenses: listing, adding, editing, and deleting.
 * It coordinates data updates between the View templates and the ExpenseService.
 */
app.controller('ExpenseCtrl', ['$scope', '$location', 'ExpenseService', function($scope, $location, ExpenseService) {
  
  // Available expense categories
  $scope.categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Other'];
  
  // Load expenses array to display in the list table
  $scope.expenses = ExpenseService.getExpenses();

  /**
   * Initialize Controller State
   * Checks if we are in Edit Mode or Add Mode by inspecting the Service's active edit reference.
   */
  $scope.init = function() {
    if (ExpenseService.activeEditExpense !== null) {
      // Edit mode: Load the expense data into the form.
      // We use angular.copy to prevent updating the list in real-time before clicking save.
      $scope.expenseForm = angular.copy(ExpenseService.activeEditExpense);
      
      // Ensure the date is a valid Javascript Date object for the HTML5 date input
      if ($scope.expenseForm.date) {
        $scope.expenseForm.date = new Date($scope.expenseForm.date);
      }
      $scope.isEditing = true;
    } else {
      // Add mode: Reset form to empty fields
      $scope.resetForm();
      $scope.isEditing = false;
    }
  };

  /**
   * Reset form values to default blank states.
   */
  $scope.resetForm = function() {
    $scope.expenseForm = {
      description: '',
      amount: null,
      category: '',
      date: new Date() // Pre-fills with today's date
    };
    
    // Clear the edit state in service
    ExpenseService.activeEditExpense = null;
    $scope.isEditing = false;
  };

  /**
   * Submit handler for adding a new expense.
   */
  $scope.addExpense = function() {
    // Perform simple validation check
    if (!$scope.expenseForm.description || !$scope.expenseForm.amount || !$scope.expenseForm.category || !$scope.expenseForm.date) {
      return; // Stop submission if fields are missing
    }

    if ($scope.expenseForm.amount <= 0) {
      return; // Amount must be greater than zero
    }

    // Call service to save the expense
    ExpenseService.addExpense(angular.copy($scope.expenseForm));
    
    // Reset the form and redirect to history log
    $scope.resetForm();
    $location.path('/view-expenses');
  };

  /**
   * Pre-populates the service state and redirects user to form page.
   * @param {Object} expense - The expense item to edit.
   */
  $scope.editExpense = function(expense) {
    // Save current selection to service
    ExpenseService.activeEditExpense = expense;
    // Redirect to the form route
    $location.path('/add-expense');
  };

  /**
   * Submit handler for updating an existing expense.
   */
  $scope.updateExpense = function() {
    // Perform validation check
    if (!$scope.expenseForm.description || !$scope.expenseForm.amount || !$scope.expenseForm.category || !$scope.expenseForm.date) {
      return;
    }

    if ($scope.expenseForm.amount <= 0) {
      return;
    }

    // Call service to update the array
    ExpenseService.updateExpense(angular.copy($scope.expenseForm));
    
    // Clear active editing state
    ExpenseService.activeEditExpense = null;
    $scope.isEditing = false;
    
    // Redirect back to view history
    $location.path('/view-expenses');
  };

  /**
   * Delete an expense by ID and reload the controller list.
   * @param {number} id - Unique expense ID.
   */
  $scope.deleteExpense = function(id) {
    // Confirm delete for user safety (highly rated in academic presentations)
    if (confirm('Are you sure you want to delete this expense?')) {
      ExpenseService.deleteExpense(id);
      // $scope.expenses is a direct reference to the service array;
      // the splice in ExpenseService mutates it in-place, so AngularJS
      // will automatically reflect the change in the view.
    }
  };

  // Run the initialization logic
  $scope.init();
}]);
