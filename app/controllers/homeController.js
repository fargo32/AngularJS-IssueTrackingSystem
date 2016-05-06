'use strict';

angular.module('issueTracker.controllers', [])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {
            controller: 'HomeController',
            templateUrl: 'app/views/login-register.html'
        })
    }])
    .controller('HomeController', ['$scope', 'userService', function ($scope, userService) {
        $scope.register = function (userData) {
            userService.register(userData)
                .then(function (response) {
                    $scope.login({username: userData.username, password: userData.password})
                }, function (err) {
                });
        };

        $scope.login = function (userData) {
            userService.login(userData)
                .then(function (response) {
                    sessionStorage['authToken'] = response.access_token;
                })
        };
    }]);