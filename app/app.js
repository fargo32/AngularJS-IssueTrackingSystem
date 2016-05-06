'use strict';

angular.module('issueTracker', [
        'ngRoute',
        'ngResource',
        'issueTracker.controllers.mainCtrl',
        'issueTracker.services.authentication',
        'issueTracker.services.users',
        'issueTracker.services.notifier',
        'issueTracker.directives.templates'
    ])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({
            redirectTo: '/'
        })
    }])

    .constant('BASE_URL', ' http://softuni-issue-tracker.azurewebsites.net/')
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