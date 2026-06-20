// Create the AngularJS app. The name must match ng-app in index.html.
// 'ngRoute' allows us to show different pages without reloading the browser.
var app = angular.module('ExpenseTrackerApp', ['ngRoute']);

// Define which controller and HTML file to use for each URL path
app.config(function($routeProvider) {
  $routeProvider
    .when('/dashboard',     { templateUrl: 'views/dashboard.html',     controller: 'ReportCtrl'  })
    .when('/add-expense',   { templateUrl: 'views/add-expense.html',   controller: 'ExpenseCtrl' })
    .when('/view-expenses', { templateUrl: 'views/view-expenses.html', controller: 'ExpenseCtrl' })
    .otherwise({ redirectTo: '/dashboard' }); // Unknown URL → go to dashboard
});

// NavController: highlights the active link in the navigation bar
app.controller('NavController', function($scope, $location) {

  // Returns true if the given path matches the current page URL
  // Used in the HTML like: ng-class="{'active-link': isActive('/dashboard')}"
  $scope.isActive = function(path) {
    return $location.path() === path;
  };

});
