// Create the app. Name must match ng-app="ExpenseTrackerApp" in index.html
var app = angular.module('ExpenseTrackerApp', ['ngRoute']);

// Map each URL path to an HTML template and a controller
app.config(function($routeProvider) {
  $routeProvider
    .when('/dashboard',     { templateUrl: 'views/dashboard.html',     controller: 'ReportCtrl'  })
    .when('/add-expense',   { templateUrl: 'views/add-expense.html',   controller: 'ExpenseCtrl' })
    .when('/view-expenses', { templateUrl: 'views/view-expenses.html', controller: 'ExpenseCtrl' })
    .otherwise({ redirectTo: '/dashboard' });
});

// Highlights the active nav link using $location.path()
app.controller('NavController', function($scope, $location) {
  $scope.isActive = function(path) { return $location.path() === path; };
});
