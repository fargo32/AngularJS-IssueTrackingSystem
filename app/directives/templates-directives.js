'use strict';

angular.module('issueTracker.directives.templates', [])

    .directive('ngDashboard', [function() {
        return {
            restrict: 'A',
            templateUrl: 'views/partials/dashboard.html'
        }
    }])

    .directive('ngLoginUserForm', [function() {
        return {
            restrict: 'A',
            templateUrl: 'views/partials/login.html'
        }
    }])

    .directive('ngRegisterUserForm', [function() {
        return {
            restrict: 'A',
            templateUrl: 'views/partials//register.html'
        }
    }])

    .directive('ngIssueFilter', [function() {
        return {
            restrict: 'A',
            templateUrl: 'views/issues/issue-filter.html'
        }
    }])
    .directive('ngIssueCommentForm', [function() {
        return {
            restrict: 'A',
            templateUrl: 'views/issues/issue-comment-add-form.html'
        }
    }])
    .directive('ngIssueComments', [function() {
        return {
            restrict: 'A',
            templateUrl: 'views/issues/issue-comments.html'
        }
    }]);