// Main app module — 'ngRoute' enables multi-page routing
var app = angular.module('ExpenseTrackerApp', ['ngRoute']);

// Route configuration — maps URLs to views and controllers
app.config(function($routeProvider) {
  $routeProvider
    .when('/dashboard',     { templateUrl: 'views/dashboard.html',     controller: 'ReportCtrl'  })
    .when('/add-expense',   { templateUrl: 'views/add-expense.html',   controller: 'ExpenseCtrl' })
    .when('/view-expenses', { templateUrl: 'views/view-expenses.html', controller: 'ExpenseCtrl' })
    .otherwise({ redirectTo: '/dashboard' });
});

// NavController — highlights the active link in the navbar
app.controller('NavController', function($scope, $location) {
  $scope.isActive = function(path) {
    return $location.path() === path;
  };
});
