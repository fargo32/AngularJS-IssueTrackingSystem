'use strict';

angular.module('issueTracker.controllers.mainCtrl', [])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/profile/password', {
                templateUrl: 'app/views/partials/change-password.html',
                controller: 'MainCtrl',
                access: {
                    requiresLogin: true
                }
            })
    }])
    .controller('MainCtrl', [
        '$scope',
        '$location',
        'authentication',
        'users',
        'notificationService',
        function($scope, $location, authentication, users, notificationService) {

            $scope.isAuthenticated = function() {
                return authentication.isAuthenticated();
            };

            $scope.isAdmin = function() {
                return authentication.isAdmin();
            };


            $scope.logout = function() {
                authentication.logoutUser()
                    .then(function success() {
                        sessionStorage.clear();
                        notificationService.showSuccess('User logged out successfully');
                        $location.path('/');
                    }, function error(err) {
                        notificationService.showError('Unsuccessful logout', err);
                    });
            };

            $scope.changePassword = function(user) {
                authentication.changePassword(user)
                    .then(function success() {
                        notificationService.showSuccess('Password changed successfully!');
                        $location.path('/');
                    }, function error(err) {
                        notificationService.showError('Failed to change password.', err);
                    });
            };

            $scope.allUsers = function() {
                users.getAllUsers()
                    .then(function success(response) {
                        $scope.users = response;
                    }, function error(err) {
                        notificationService.showError('Unable to get all users', err)
                    });
            }
        }]);