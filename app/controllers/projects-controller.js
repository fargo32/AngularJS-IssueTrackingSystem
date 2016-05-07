'use strict';

angular.module('issueTracker.controllers.projects', [])
    .config(['$routeProvider', function($routeProvider) {
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

    }])
    .controller('ProjectsController', [
        '$scope',
        '$location',
        'projectsService',
        'notificationService',
        'PAGE_SIZE',
        function($scope, $location, projects, notificationService, pageSize) {
            $scope.projectsParams = {
                pageSize: pageSize,
                pageNumber: 1
            };

            $scope.allUsers();

            $scope.addProject = function(project) {
                projectsService.addProject(project)
                    .then(function success(data) {
                        $location.path('projects/' + data.Id);
                    }, function error(err) {
                        notificationService.showError('Unable to add project', err);
                    });
            };

            $scope.getAllProjects = function() {
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
        function($scope, projectsService, pageSize, notificationService) {
            $scope.myProjectsParams = {
                pageSize: pageSize,
                pageNumber: 1
            };

            $scope.getMyProjects = function() {
                projectsService.getUserProjects($scope.myProjectsParams)
                    .then(function success(data) {
                        $scope.myProjects = data.Projects;
                        $scope.myTotalProjects = data.TotalCount;
                    }, function error() {
                        notificationService.showError('Unable to get user projects.', err);
                    });
            };

            $scope.getMyProjects();
        }]);