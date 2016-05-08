'use strict';

angular.module('issueTracker', [
        'ngRoute',
        'ngResource',
    'ngStorage',
    'ui.bootstrap.pagination',
        'issueTracker.controllers.mainCtrl',
        'issueTracker.controllers.home',
        'issueTracker.controllers.projects',
        'issueTracker.controllers.issues',
        'issueTracker.services.authentication',
        'issueTracker.services.users',
        'issueTracker.services.notifier',
        'issueTracker.services.issues',
        'issueTracker.services.projects',
        'issueTracker.services.comments',
        'issueTracker.directives.templates'
    ])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({
            redirectTo: '/'
        })
    }])

    .constant('BASE_URL', 'http://softuni-issue-tracker.azurewebsites.net/')
    .constant('PAGE_SIZE', 5)
    .run([
        '$rootScope',
        '$location',
        'authentication',
        function ($rootScope, $location, authentication) {
            $rootScope.$on('$routeChangeStart', function (event, nextRoute) {
                if (nextRoute.access) {
                    if (nextRoute.access.requiresLogin && !authentication.isAuthenticated()) {
                        $location.path('/');
                    }

                    if (nextRoute.access.requiresAdmin && !authentication.isAdmin()) {
                        $location.path('/');
                    }
                } else {
                    $location.path('/');
                }
            });
        }]);