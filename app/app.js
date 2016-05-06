'use strict';

angular.module('issueTracker', [
        'ngRoute',
        'ngResource'
    ])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({
            redirectTo: '/'
        })
    }])

    .constant('BASE_URL', ' http://softuni-issue-tracker.azurewebsites.net/');