'use strict';

angular.module('issueTracker.services.users', [])
    .factory('usersService', [
        '$http',
        '$q',
        'BASE_URL',
        function ($http, $q, BASE_URL) {

            function getAllUsers() {
                var deferred = $q.defer();

                var req = {
                    method: 'GET',
                    url: BASE_URL + 'users',
                    headers: {
                        Authorization: 'Bearer ' + JSON.parse(sessionStorage['currentUser']).access_token
                    }
                };

                $http(req)
                    .then(function success(response) {
                        deferred.resolve(response.data);
                    }, function error(err) {
                        deferred.reject(err);
                    });

                return deferred.promise;
            }

            return {
                getAllUsers: getAllUsers
            }
        }]);