'use strict';

angular.module('issueTracker.controllers.AuthenticationController', [])
    .controller('AuthenticationController', [
        '$scope',
        '$route',
        'authService',
        'usersService',
        'notificationService',
        function AuthenticationController($scope, $route, authService, usersService, notificationService) {
            $scope.login = function (user) {
                if (user) {
                    user.grant_type = 'password';
                    authService.loginUser(user)
                        .then(function (response) {
                            localStorage['accessToken'] = response.data.access_token;
                            localStorage['username'] = response.data.userName;
                            usersService.getCurrentUserInfo()
                                .then(function (userInfo) {
                                    localStorage['currentUserId'] = userInfo.data.Id;
                                    localStorage['isAdmin'] = userInfo.data.isAdmin;
                                    $route.reload();
                                    notificationService.showInfo('Login successful!');
                                })
                        }, function (error) {
                            notificationService.showError("Login error", error);
                        });
                }
            };

            $scope.register = function (user) {
                if (user) {
                    authService.registerUser(user)
                        .then(function () {
                            var loginUserData = {
                                username: user.email,
                                password: user.password,
                                grant_type: GRANT_TYPE
                            };
                            notificationService.showInfo('Registration successful!');
                            $scope.login(loginUserData);
                        }, function (error) {
                            notificationService.showError("Registration error", error);
                        });
                }
            };

            $scope.changePassword = function (passwordInfo) {
                if (passwordInfo) {
                    authService.changePassword(passwordInfo)
                        .then(function () {
                            notificationService.showInfo('Password changed successfully!');
                            $route.reload();
                        }, function (error) {
                            notificationService.showError("Password change error", error);
                        });
                }
            };

            $scope.logout = function () {
                authService.logoutUser();
            };

            $scope.isAuthenticated = authService.isAuthenticated();

            $scope.isAdmin = authService.isAdmin();

            $scope.username = localStorage['username'];
        }
    ]);