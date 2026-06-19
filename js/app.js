/**
 * Personal Expense Tracker - AngularJS 1.8 Application Configuration
 * 
 * This file defines the main application module and configures the routes
 * using ngRoute. It also configures a NavController to manage active menu states.
 */

// Define the main AngularJS application module.
// We inject 'ngRoute' to enable Single Page Application (SPA) routing.
var app = angular.module('ExpenseTrackerApp', ['ngRoute']);

// Configure the routes for the application.
app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    // Route for the Dashboard / Reports page
    .when('/dashboard', {
      templateUrl: 'views/dashboard.html',
      controller: 'ReportCtrl'
    })
    // Route for the Add Expense or Edit Expense form page
    .when('/add-expense', {
      templateUrl: 'views/add-expense.html',
      controller: 'ExpenseCtrl'
    })
    // Route for listing and filtering expenses
    .when('/view-expenses', {
      templateUrl: 'views/view-expenses.html',
      controller: 'ExpenseCtrl'
    })
    // Fallback route: redirect to dashboard if route is not recognized
    .otherwise({
      redirectTo: '/dashboard'
    });
}]);

// NavController helps highlight the active menu item in the navbar
app.controller('NavController', ['$scope', '$location', function($scope, $location) {
  /**
   * Helper function to check if a specific path is active.
   * Compare the current location path to the target path.
   * @param {string} viewLocation - The route path to check.
   * @returns {boolean} True if the route is active, false otherwise.
   */
  $scope.isActive = function(viewLocation) {
    return $location.path() === viewLocation;
  };
}]);
