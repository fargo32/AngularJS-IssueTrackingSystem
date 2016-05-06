'use strict';

angular.module('issueTracker.services.notifier', [])
    .factory('notificationService', [
        function () {
            return {
                showSuccess: function (msg) {
                    noty({
                            theme: 'relax',
                            text: msg,
                            type: 'information',
                            layout: 'topCenter',
                            timeout: 3000,
                            closeWith: ['click']
                        }
                    );
                },
                showError: function (msg, serverError) {
                    var errors = [];
                    if (serverError && serverError.data.error_description) {
                        errors.push(serverError.data.error_description);
                    }
                    if (serverError && serverError.data.Message) {
                        errors.push(serverError.data.Message);
                    }
                    if (serverError && serverError.data.ModelState) {
                        var modelStateErrors = serverError.data.ModelState;
                        for (var propertyName in modelStateErrors) {
                            var errorMessages = modelStateErrors[propertyName];
                            var trimmedName =
                                propertyName.substr(propertyName.indexOf('.') + 1);
                            for (var i = 0; i < errorMessages.length; i++) {
                                var currentError = errorMessages[i];
                                errors.push(trimmedName + ' - ' + currentError);
                            }
                        }
                    }
                    if (errors.length > 0) {
                        msg = msg + ":<br>" + errors.join("<br>");
                    }
                    noty({
                            theme: 'relax',
                            text: msg,
                            type: 'error',
                            layout: 'topCenter',
                            timeout: 5000,
                            closeWith: ['click']
                        }
                    );
                }
            }
        }
    ]);


