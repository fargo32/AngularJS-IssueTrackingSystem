'use strict';

angular.module('issueTracker.controllers.home', [])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeController',
            access: {
                requiresLogin: true
            }
        })
    }])

    .controller('HomeController', [
        '$scope',
        'authentication',
        'usersService',
        'notificationService',
        'issuesService',
        '$location',
        'PAGE_SIZE',
        function ($scope, authentication, usersService, notificationService, issuesService, $location, PAGE_SIZE) {

            $scope.issuesParams = {
                pageSize: PAGE_SIZE,
                pageNumber: 1
            };

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
                    .then(function success() {
                        $scope.getUserAssignedIssues();
                        notificationService.showSuccess('You have been logged in successfully!');
                    }, function error(err) {
                        notificationService.showError('Login failed!', err);
                    });
            };

            $scope.getUserAssignedIssues = function (predicate) {
                var criteria = predicate || 'DueDate';

                if (authentication.isAuthenticated()) {
                    issuesService.getUserAssignedIssues(criteria, $scope.issuesParams)
                        .then(function success(data) {
                            $scope.userIssues = data.Issues;
                            $scope.userIssuesCount = data.TotalPages * $scope.issuesParams.pageSize;
                        }, function error(err) {
                            notificationService.showError('Unable to get issues', err);
                        });
                }
            };

            $scope.getUserAssignedIssues();
        }]);