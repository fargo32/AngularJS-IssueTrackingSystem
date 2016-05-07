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
                    requiresAdmin: true
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
                projectsService.addProject(project)
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
    console.log(data);
                    if (data.Lead.Id === JSON.parse(sessionStorage['currentUser']).Id) {
                        $scope.isLeadOfProject = true;
                    } else {
                        $scope.isLeadOfProject = false;
                    }
    console.log($scope.isLeadOfProject);
                    $scope.currentProjectLabels = [];
                    $scope.currentProjectPriorities = [];

                    data.Labels.forEach(function (l) {
                        $scope.currentProjectLabels.push(l.Name);
                    });
                    console.log($scope.currentProjectLabels);
                    console.log($scope.currentProject);

                    data.Priorities.forEach(function (p) {
                        $scope.currentProjectPriorities.push(p.Name);
                    });
                }, function error(err) {
                    notificationService.showError('Unable to get project', err);
                });


        }]);