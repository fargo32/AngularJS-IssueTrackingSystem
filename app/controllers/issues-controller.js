'use strict';

angular.module('issueTracker.controllers.issues', [])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/issues/:id', {
                templateUrl: 'views/issues/issue.html',
                controller: 'ViewIssueController',
                access: {
                    requiresLogin: true
                }
            })
            .when('/issues/:id/edit', {
                templateUrl: 'views/issues/edit-issue.html',
                controller: 'EditIssueController',
                access: {
                    requiresLogin: true
                }
            })
    }])
    .controller('ViewIssueController', [
        '$scope',
        '$routeParams',
        'issuesService',
        'projectsService',
        'notificationService',
        function ($scope, $routeParams, issuesService, projectsService, notificationService) {

            $scope.getIssueById = function() {
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

            $scope.getIssueById();
        }])

    .controller('EditIssueController', [
        '$scope',
        '$routeParams',
        '$location',
        'issuesService',
        'projectsService',
        'notificationService',
        function ($scope, $routeParams, $location, issuesService, projectsService, notificationService) {

            $scope.allUsers();

            issuesService.getIssueById($routeParams.id)
                .then(function success(data) {
                    $scope.currentIssue = data;
                    $scope.currentIssueDueDateLocal = new Date(data.DueDate);
                    $scope.issuePriority = data.Priority.Id;
                    $scope.currentIssueLabels = [];

                    data.Labels.forEach(function (label) {
                        $scope.currentIssueLabels.push(label.Name);
                    });

                    projectsService.getProjectById(data.Project.Id)
                        .then(function success(data) {
                            $scope.projectPriorities = data.Priorities;
                        });
                }, function error(err) {
                    notificationService.showError('Unable to get issue', err);
                });

            $scope.editIssue = function () {
                if (typeof $scope.currentIssueLabels === 'string') {
                    $scope.currentIssueLabels = $scope.currentIssueLabels.split(',');
                }

                var issueToEdit = {
                    Title: $scope.currentIssue.Title,
                    Description: $scope.currentIssue.Description,
                    DueDate: $scope.currentIssueDueDateLocal,
                    AssigneeId: $scope.currentIssue.Assignee.Id,
                    PriorityId: $scope.issuePriority,
                    Labels: $scope.currentIssueLabels
                };

                issuesService.editIssue(issueToEdit, $routeParams.id)
                    .then(function success(data) {
                        $location.path('issues/' + data.Id);
                    }, function error(err) {
                        notificationService.showError('Unable to edit issue', err);
                    });
            };
        }])
;