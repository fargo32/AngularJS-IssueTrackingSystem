'use strict';

angular.module('issueTracker.directives.templates', [])

    .directive('ngDashboard', [function() {
        return {
            restrict: 'A',
            templateUrl: 'app/views/partials/dashboard.html'
        }
    }])

    .directive('ngLoginUserForm', [function() {
        return {
            restrict: 'A',
            templateUrl: 'app/views/partials/login.html'
        }
    }])

    .directive('ngRegisterUserForm', [function() {
        return {
            restrict: 'A',
            templateUrl: 'app/views/partials//register.html'
        }
    }]);