'use strict';

angular.module('issueTracker.services.issues', [])
    .factory('issuesService', [
        '$http',
        '$q',
        'BASE_URL',
        function ($http, $q, BASE_URL) {

            function getUserAssignedIssues(criteria, params) {

                var deferred = $q.defer();

                var req = {
                    method: 'GET',
                    url: BASE_URL + 'issues/me?orderBy=' + criteria + ' desc&pageSize=' + params.pageSize + '&pageNumber=' + params.pageNumber,
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

            function editIssue(issue, id) {
                var deferred = $q.defer();

                var dataLabels = '';
                issue.Labels.forEach(function (l, index) {
                    dataLabels += '&labels[' + index + '].Name=' + l.trim();
                });

                var data = 'Title=' + issue.Title +
                    '&Description=' + issue.Description +
                    '&DueDate=' + issue.DueDate.toISOString() +
                    '&AssigneeId=' + issue.AssigneeId +
                    '&PriorityId=' + issue.PriorityId +
                    dataLabels;

                var req = {
                    method: 'PUT',
                    url: BASE_URL + 'issues/' + id,
                    headers: {
                        'Authorization': 'Bearer ' + JSON.parse(sessionStorage['currentUser']).access_token,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: data
                };

                $http(req)
                    .then(function success(response) {
                        deferred.resolve(response.data);
                    }, function error(err) {
                        console.log(err);
                        deferred.reject(err);
                    });

                return deferred.promise;
            }

            function getIssueById(id) {
                var deferred = $q.defer();

                var req = {
                    method: 'GET',
                    url: BASE_URL + 'issues/' + id,
                    headers: {
                        'Authorization': 'Bearer ' + JSON.parse(sessionStorage['currentUser']).access_token,
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
                getUserAssignedIssues: getUserAssignedIssues,
                editIssue: editIssue,
                getIssueById: getIssueById
            }
        }]);