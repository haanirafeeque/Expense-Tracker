var app = angular.module('ExpenseTrackerApp', ['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider
    .when('/dashboard',     { templateUrl: 'views/dashboard.html',     controller: 'ReportCtrl'  })
    .when('/add-expense',   { templateUrl: 'views/add-expense.html',   controller: 'ExpenseCtrl' })
    .when('/view-expenses', { templateUrl: 'views/view-expenses.html', controller: 'ExpenseCtrl' })
    .otherwise({ redirectTo: '/dashboard' });
});

app.controller('NavController', function($scope, $location) {
  $scope.isActive = function(path) {
    return $location.path() === path;
  };
});
