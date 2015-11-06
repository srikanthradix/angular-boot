(function () {
    'use strict';

    angular.module('myApp.newEmplForm', ['myApp.constants', 'ngResource', 'ui.router'])

        .config(['NAV', '$stateProvider', '$urlRouterProvider', function (NAV, $stateProvider, $urlRouterProvider) {
            $stateProvider
                .state(NAV.NEW_EMP.ID, {
                    url: '/idForm',
                    templateUrl: 'html/forms/empl/new/idForm.html'
                })
                .state(NAV.NEW_EMP.PROFILE, {
                    url: '/profileForm',
                    templateUrl: 'html/forms/empl/new/profileForm.html'
                });

            $urlRouterProvider.otherwise('/');
        }])

        .controller('NewEmplCtrl', ['NAV', '$state', 'empService', function (NAV, $state, empService) {
            var self = this;
            self.master = self.master || {};
            self.message = "";

            self.next = function (emp) {
                angular.extend(self.master, emp);
            };

            self.save = function (emp) {
                angular.extend(emp, self.master);
                empService.save(emp).$promise
                    .then(function (data) {
                        self.message = 'Employee signed up: ' + data.id
                    }, function (error) {
                        console.log(error);
                        self.message = 'There is an error signing up employee. Please contact customer support.';
                    })
                    .finally(function () {
                        self.reset();
                        $state.go(NAV.NEW_EMP.ID);
                    });
            };

            self.search = function (id) {
                self.emps = []
                empService.get({id: id})
                    .$promise.then(function (data) {
                        self.emps.push(data);
                    })
            }

            self.reset = function () {
                self.emp = self.master = {};
            };
        }])

        .service('empService', ['$resource', function ($resource) {
            return $resource('/emp/:id', {id: '@_id'}, {
                update: {
                    method: 'PUT' // this method issues a PUT request
                }
            });
        }])

        .directive('empAvail', ['empService', function (empService) {
            return {
                require: 'ngModel',
                link: function (scope, elm, attrs, ctrl) {
                    ctrl.$asyncValidators.empAvail = function (modelValue, viewValue) {
                        if (ctrl.$isEmpty(viewValue)) {
                            return true;
                        } else {
                            //GET http://localhost:8080/emp?id=v
//                		return $http.get('/emp', {params: {id: viewValue}})
                            return empService.get({id: viewValue})
                                .$promise.then(
                                function (data) {
                                    if (data.id === viewValue) {
                                        ctrl.$setValidity('id', false);
                                    } else {
                                        ctrl.$setValidity('id', true);
                                    }
                                }
                            );
                        }
                    };
                }
            };
        }])
})();