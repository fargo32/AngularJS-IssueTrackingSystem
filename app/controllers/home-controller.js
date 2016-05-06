'use strict';

angular.module('issueTracker.controllers.home', [])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('#/', {
            templateUrl: 'app/views/home.html',
            controller: 'HomeController',
            access: {
                requiresLogin: true
            }
        })
    }])

    .controller('HomeController', [
        '$scope',
        'authentication',
        'notificationService',
        '$location',
        function ($scope, authentication, notificationService, $location) {

            $scope.register = function (userData) {
                authentication.registerUser(userData)
                    .then(function success() {
                        notificationService.showSuccess('Successful registration!')
                        $scope.login(userData)
                    }, function (err) {
                        notificationService.showError('Failed to register!', err)
                    });
            };

            $scope.login = function (userData) {
                authentication.loginUser(userData)
                    .then(function success(userData) {

                        //todo $scope.getUserIssues();
                        notificationService.showSuccess('You have been logged in successfully!');
                    }, function error(err) {
                        notificationService.showError('Login failed!', err);
                    });
            };

            //todo $scope.getUserIssues
        }]);