'use strict';

angular.module('issueTracker.services.comments', [])
    .factory('commentsService', [
        '$http',
        '$q',
        'BASE_URL',
        function($http, $q, BASE_URL) {
        function getIssueComments(id) {
            var deferred = $q.defer();

            var req = {
                method: 'GET',
                url: BASE_URL + 'issues/' + id + '/comments',
                headers: {
                    'Authorization': 'Bearer ' + JSON.parse(sessionStorage['currentUser']).access_token
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

        function addCommentToIssue(issueId, comment) {
            var deferred = $q.defer();

            var req = {
                method: 'POST',
                url: BASE_URL + 'issues/' + issueId + '/comments',
                headers: {
                    'Authorization': 'Bearer ' + JSON.parse(sessionStorage['currentUser']).access_token
                },
                data: comment
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
            getIssueComments: getIssueComments,
            addCommentToIssue: addCommentToIssue
        }
    }]);