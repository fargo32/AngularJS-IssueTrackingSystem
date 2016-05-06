'use strict';

angular.module('issueTracker.controllers', [])
    .controller('MainCtrl', [
        '$scope',
        'identity',
        function($scope, identity) {
            identity.getCurrentUser()
                .then(function(user) {
                    $scope.currentUser = user;
                    $scope.isAuthenticated = true;
                });
        }]);