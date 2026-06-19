/**
 * app.js — Application Module & Route Configuration
 *
 * CONCEPT: angular.module()
 * This creates the main AngularJS app. The name here ('ExpenseTrackerApp')
 * must match the ng-app attribute in index.html.
 * ['ngRoute'] means we are loading the ngRoute module so we can have
 * multiple "pages" inside one HTML file (Single Page Application).
 */
var app = angular.module('ExpenseTrackerApp', ['ngRoute']);


/**
 * CONCEPT: app.config() + $routeProvider
 * This sets up the routes (pages) of our app.
 * Each .when() call maps a URL path to an HTML template and a controller.
 * The template is loaded inside the <div ng-view> in index.html.
 */
app.config(function($routeProvider) {

  $routeProvider
    .when('/dashboard', {
      templateUrl: 'views/dashboard.html',
      controller: 'ReportCtrl'
    })
    .when('/add-expense', {
      templateUrl: 'views/add-expense.html',
      controller: 'ExpenseCtrl'
    })
    .when('/view-expenses', {
      templateUrl: 'views/view-expenses.html',
      controller: 'ExpenseCtrl'
    })
    // If the user visits an unknown URL, send them to the dashboard
    .otherwise({
      redirectTo: '/dashboard'
    });

});


/**
 * CONCEPT: Controller for the navigation bar
 * The NavController is used only in index.html to highlight the active
 * nav link. $location is an AngularJS built-in service that reads the
 * current URL.
 */
app.controller('NavController', function($scope, $location) {

  // Returns true if the given path matches the current page URL
  $scope.isActive = function(path) {
    return $location.path() === path;
  };

});
