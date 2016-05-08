'use strict';

angular.module('issueTracker.controllers.projects', [])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/projects', {
                templateUrl: 'views/projects/all-projects.html',
                controller: 'ProjectsController',
                access: {
                    requiresAdmin: true
                }
            })
            .when('/projects/my', {
                templateUrl: 'views/projects/my-projects.html',
                controller: 'MyProjectsController',
                access: {
                    requiresLogin: true
                }
            })
            .when('/projects/add', {
                templateUrl: 'views/projects/add-project.html',
                controller: 'ProjectsController',
                access: {
                    requiresAdmin: true
                }
            })
            .when('/projects/:id', {
                templateUrl: 'views/projects/project.html',
                controller: 'ViewProjectController',
                access: {
                    requiresLogin: true
                }
            })
            .when('/projects/:id/edit', {
                templateUrl: 'views/projects/edit-project.html',
                controller: 'EditProjectController',
                access: {
                    requiresLogin: true
                }
            })
            .when('/projects/:id/add-issue', {
                templateUrl: 'views/issues/add-issue.html',
                controller: 'AddIssueToProjectController',
                access: {
                    requiresLogin: true
                }
            })

    }])

    .controller('ProjectsController', [
        '$scope',
        '$location',
        'projectsService',
        'notificationService',
        'PAGE_SIZE',
        function ($scope, $location, projectsService, notificationService, pageSize) {
            $scope.projectsParams = {
                pageSize: pageSize,
                pageNumber: 1
            };

            $scope.allUsers();

            $scope.addProject = function (project) {
                projectsService.addNewProject(project)
                    .then(function success(data) {
                        $location.path('projects/' + data.Id);
                    }, function error(err) {
                        notificationService.showError('Unable to add project', err);
                    });
            };

            $scope.getAllProjects = function () {
                projectsService.getAllProjects($scope.projectsParams)
                    .then(function success(data) {
                        $scope.allProjects = data.Projects;
                        $scope.projectsCount = data.TotalPages * $scope.projectsParams.pageSize;
                    }, function error(err) {
                        notificationService.showError('Unable to get projects', err);
                    });
            };

            $scope.getAllProjects();
        }])

    .controller('MyProjectsController', [
        '$scope',
        'projectsService',
        'PAGE_SIZE',
        'notificationService',
        function ($scope, projectsService, pageSize, notificationService) {
            $scope.myProjectsParams = {
                pageSize: pageSize,
                pageNumber: 1
            };

            $scope.getUserProjects = function () {
                projectsService.getUserProjects($scope.myProjectsParams)
                    .then(function success(data) {
                        $scope.myProjects = data.Projects;
                        $scope.myTotalProjects = data.TotalCount;
                    }, function error() {
                        notificationService.showError('Unable to get user projects.', err);
                    });
            };

            $scope.getUserProjects();
        }])

    .controller('ViewProjectController', [
        '$scope',
        '$routeParams',
        'projectsService',
        'notificationService',
        function ($scope, $routeParams, projectsService, notificationService) {

            projectsService.getProjectById($routeParams.id)
                .then(function success(data) {

                    $scope.currentProject = data;

                    if (data.Lead.Id === JSON.parse(sessionStorage['currentUser']).Id) {
                        $scope.isLeadOfProject = true;
                    } else {
                        $scope.isLeadOfProject = false;
                    }

                    $scope.currentProjectLabels = [];
                    $scope.currentProjectPriorities = [];

                    data.Labels.forEach(function (l) {
                        $scope.currentProjectLabels.push(l.Name);
                    });

                    data.Priorities.forEach(function (p) {
                        $scope.currentProjectPriorities.push(p.Name);
                    });
                }, function error(err) {
                    notificationService.showError('Unable to get project', err);
                });

            projectsService.getIssuesByProjectId(($routeParams.id))
                .then(function success(issuesData) {
                    $scope.currentProjectIssues = issuesData;
                    $scope.currentProjectIssuesAssignees = [];
                    $scope.currentProjectIssuesPriorities = []

                    issuesData.forEach(function (issue) {

                        if ($scope.currentProjectIssuesAssignees.indexOf(issue.Assignee.Username) === -1) {
                            $scope.currentProjectIssuesAssignees.push(issue.Assignee.Username);
                        }

                        if ($scope.currentProjectIssuesPriorities.indexOf(issue.Priority.Name) === -1) {
                            $scope.currentProjectIssuesPriorities.push(issue.Priority.Name);
                        }
                    });
                }, function error(err) {
                    notificationService.showError('Unable to get issues', err);
                });
        }])

    .controller('EditProjectController', [
        '$scope',
        '$routeParams',
        'projectsService',
        'notificationService',
        '$location',
        function ($scope, $routeParams, projectsService, notificationService, $location) {

            $scope.allUsers();

            projectsService.getProjectById($routeParams.id)
                .then(function success(data) {

                    $scope.currentProject = data;

                    $scope.currentProjectLabels = [];
                    $scope.currentProjectPriorities = [];

                    data.Labels.forEach(function (l) {
                        $scope.currentProjectLabels.push(l.Name);
                    });

                    data.Priorities.forEach(function (p) {
                        $scope.currentProjectPriorities.push(p.Name);
                    });
                }, function error(err) {
                    notificationService.showError('Unable to get project', err);
                });

            $scope.editProject = function () {
                if (typeof $scope.currentProjectLabels === 'string') {
                    $scope.currentProjectLabels = getArrayOfStrings($scope.currentProjectLabels);
                }
                if (typeof $scope.currentProjectPriorities === 'string') {
                    $scope.currentProjectPriorities = getArrayOfStrings($scope.currentProjectPriorities);
                }

                var projectForEdit = {
                    Name: $scope.currentProject.Name,
                    Description: $scope.currentProject.Description,
                    Priorities: $scope.currentProjectPriorities,
                    Labels: $scope.currentProjectLabels,
                    LeadId: $scope.currentProject.Lead.Id
                };

                projectsService.editProject(projectForEdit, $routeParams.id)
                    .then(function success(data) {
                        $location.path('projects/' + data.Id)
                    }, function error(err) {
                        notificationService.showError('Unable to edit project', err);
                    });
            };

            function getArrayOfStrings(str) {
                return str.split(',');
            }
        }])

    .controller('AddIssueToProjectController', [
        '$scope',
        '$routeParams',
        'projectsService',
        'notificationService',
        '$location',
        function ($scope, $routeParams, projectsService, notificationService, $location) {

            $scope.allUsers();

            projectsService.getProjectById($routeParams.id)
                .then(function success(data) {
                    $scope.projectPriorities = data.Priorities;
                }, function error(err) {
                    notificationService.showError('Unable to get project', err);
                });

            $scope.addIssueToProject = function (issueToAdd) {

                var issueToSend = {
                    Title: issueToAdd.Title,
                    Description: issueToAdd.Description,
                    DueDate: issueToAdd.DueDate,
                    ProjectId: $routeParams.id,
                    AssigneeId: issueToAdd.AssigneeId,
                    PriorityId: issueToAdd.PriorityId,
                    Labels: issueToAdd.Labels.split(',')
                };

                projectsService.addIssueToProject(issueToSend)
                    .then(function success(data) {
                        $location.path('projects/' + data.Project.Id)
                    }, function error(err) {
                        notificationService.showError('Unable to add issue', err);
                    });
            };
        }])

;