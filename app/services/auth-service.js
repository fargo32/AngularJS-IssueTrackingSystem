'use strict';

angular.module('issueTracker.services.authService', [])
    .factory('authService', [
        '$http',
        '$q',
        'BASE_URL',
        'notificationService',
        function ($http, $q, BASE_URL, notificationService) {

            function registerUser(user) {
                var deffered = $q.defer();

                $http.post(BASE_URL + 'api/Account/Register', user)
                    .then(function (result) {
                        deffered.resolve(result);
                    }, function (error) {
                        deffered.reject(error);
                    });

                return deffered.promise;
            }

            function loginUser(user) {
                var deffered = $q.defer();

                var config = {
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    transformRequest: function (params) {
                        var encodedParams = [];
                        for (var key in params) {
                            encodedParams.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
                        }
                        return encodedParams.join('&');
                    }
                };

                $http.post(BASE_URL + 'api/Token', user, config)
                    .then(function (result) {
                        deffered.resolve(result);
                    }, function (error) {
                        deffered.reject(error);
                    });

                return deffered.promise;
            }

            function changePassword(passwordInfo) {
                var deffered = $q.defer();

                $http.post(BASE_URL + 'api/Account/ChangePassword', passwordInfo)
                    .then(function (result) {
                        deffered.resolve(result);
                    }, function (error) {
                        deffered.reject(error);
                    });

                return deffered.promise;
            }

            function logoutUser() {
                localStorage.clear();
                notificationService.showInfo('Logout successful!');
            }

            function isAuthenticated() {
                return localStorage['accessToken'];
            }

            function isAdmin() {
                var isAdmin = localStorage['isAdmin'] === 'true';
                return isAdmin;
            }

            return {
                registerUser: registerUser,
                loginUser: loginUser,
                changePassword: changePassword,
                logoutUser: logoutUser,
                isAuthenticated: isAuthenticated,
                isAdmin: isAdmin
            };
        }
    ]);