'use strict';

angular.module('issueTracker.services.projects', [])
    .factory('projectsService', [
        '$http',
        '$q',
        'BASE_URL',
        function ($http, $q, BASE_URL) {

        function getAllProjects(params) {
            var deferred = $q.defer(),
                projectsReq = {
                    method: 'GET',
                    url: BASE_URL + 'projects?filter=&pageSize=' + params.pageSize + '&pageNumber=' + params.pageNumber,
                    headers: {
                        'Authorization': 'Bearer ' + JSON.parse(sessionStorage['currentUser']).access_token
                    }
                };

            $http(projectsReq)
                .then(function success(response) {
                    deferred.resolve(response.data);
                }, function error(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        }

        function addNewProject(project) {
            var deferred = $q.defer();

            var labels = project.labels.split(',');
            var dataLabels = '';
            labels.forEach(function (l, index) {
                dataLabels += '&labels[' + index + '].Name=' + l.trim();
            });

            var priorities = project.priorities.split(',');
            var dataPriorities = '';
            priorities.forEach(function (p, index) {
                dataPriorities += '&priorities[' + index + '].Name=' + p.trim();
            });

            var data = 'Name=' + project.name +
                '&Description=' + project.description +
                '&ProjectKey=' + project.key +
                dataLabels + dataPriorities +
                '&LeadId=' + project.leadId;

            var req = {
                method: 'POST',
                url: BASE_URL + 'projects',
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
                    deferred.reject(err);
                });

            return deferred.promise;
        }

        function getProjectById(projectId) {
            var deferred = $q.defer(),
                projectReq = {
                    method: 'GET',
                    url: BASE_URL + 'projects/' + projectId,
                    headers: {
                        'Authorization': 'Bearer ' + JSON.parse(sessionStorage['currentUser']).access_token
                    }
                };

            $http(projectReq)
                .then(function success(response) {
                    deferred.resolve(response.data);
                }, function error(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        }

        function getIssuesByProjectId(projectId) {
            var deferred = $q.defer(),
                issuesReq = {
                    method: 'GET',
                    url: BASE_URL + 'projects/' + projectId + '/issues',
                    headers: {
                        'Authorization': 'Bearer ' + JSON.parse(sessionStorage['currentUser']).access_token
                    }
                };

            $http(issuesReq)
                .then(function success(response) {
                    deferred.resolve(response.data);
                }, function error(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        }

        function getUserProjects(params) {
            var leadId = JSON.parse(sessionStorage['currentUser']).Id;
            var deferred = $q.defer();

            var projectsReq = {
                method: 'GET',
                url: BASE_URL + 'projects?filter=Lead.Id="' + leadId +'"&pageSize=' + params.pageSize + '&pageNumber=' + params.pageNumber,
                headers: {
                    'Authorization': 'Bearer ' + JSON.parse(sessionStorage['currentUser']).access_token
                }
            };

            $http(projectsReq)
                .then(function success(response) {
                    deferred.resolve(response.data);
                }, function error(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        }


        return {
            getAllProjects: getAllProjects,
            addNewProject: addNewProject,
            getProjectById: getProjectById,
            getIssuesByProjectId: getIssuesByProjectId,
            getUserProjects: getUserProjects
        }
    }]);