'use strict';

angular.module('issueTracker.controllers.issues', [])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/issues/:id', {
                templateUrl: 'views/partials/issues/issue.html',
                controller: 'ViewIssueController',
                access: {
                    requiresLogin: true
                }
            })
    }])
    .controller('ViewIssueController', [
        '$scope',
        '$routeParams',
        'issuesService',
        'comments',
        'projectsService',
        'notificationService',
        function ($scope, $routeParams, issuesService, comments, projectsService, notificationService) {
            $scope.issueComment = {};

            $scope.getIssueById = function () {
                issuesService.getIssueById($routeParams.id)
                    .then(function success(data) {
                        $scope.currentIssue = data;

                        if (data.Assignee.Id === JSON.parse(sessionStorage['currentUser']).Id) {
                            $scope.isAssignee = true;
                        } else {
                            $scope.isAssignee = false;
                        }

                        $scope.currentIssueLabels = [];

                        data.Labels.forEach(function (label) {
                            $scope.currentIssueLabels.push(label.Name);
                        });

                        projectsService.getProjectById(data.Project.Id)
                            .then(function success(data) {
                                if (data.Lead.Id === JSON.parse(sessionStorage['currentUser']).Id) {
                                    $scope.isLeadOfProject = true;
                                } else {
                                    $scope.isLeadOfProject = false;
                                }
                            });

                    }, function error(err) {
                        notificationService.showError('Unable to get issue', err);
                    });
            };

            //todo Add status and comments


            //todo EditController
        }])

;