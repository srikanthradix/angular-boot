/**
 * Created by Srikanth on 8/27/2015.
 */
(function () {
    'use strict';

    //var ReactDOM = require('reactDom');
    angular.module('myApp.searchEmplForm', ['myApp.constants', 'ui.router', 'ngResource', 'angularUtils.directives.dirPagination'])

        .config(['NAV', '$stateProvider', '$urlRouterProvider', function (NAV, $stateProvider, $urlRouterProvider) {

            var search_views = {};
            var rsearch_views = {};

            search_views[''] = {
                templateUrl: 'html/forms/empl/search/searchEmplForm.html'
            };
            search_views[NAV.LIST_EMP.SEARCH.CRITERIA] = {
                templateUrl: 'html/forms/empl/search/search-criteria.html'
            };
            search_views[NAV.LIST_EMP.SEARCH.RESULTS] = {
                templateUrl: 'html/forms/empl/search/search-results.html'
            };
            search_views[NAV.LIST_EMP.SEARCH.FOOTER] = {
                templateUrl: 'html/forms/empl/search/search-footer.html'
            };

            $stateProvider
                .state(NAV.LIST_EMP.SEARCH.PAGE, {
                    views: search_views
                })
                .state(NAV.LIST_EMP.UPDATE, {
                    url: '/updateForm',
                    templateUrl: 'html/forms/empl/update/updateEmplForm.html'
                });

            $urlRouterProvider.otherwise('/');
        }])

        .controller('searchEmplCtrl', ['$state', 'srchFormService',
            function ($state, srchFormService) {
                var self = this;
                self.emps = [];
                self.selectedEmp = {};
                self.view2b = self.view2b || {};
                self.itemsPerPage = srchFormService.getItemsPerPage();
                self.predicate = srchFormService.getPredicate();
                self.reverse = srchFormService.getReverse();

                self.setSelectedEmployee = function () {
                    self.selectedEmp = srchFormService.setSelectedEmployee();
                }

                self.order = function (predicate) {
                    srchFormService.order(predicate);
                    self.predicate = srchFormService.getPredicate();
                    self.reverse = srchFormService.getReverse();
                }
                self.setItemsPerPage = function (itemsPerPage) {
                    srchFormService.setItemsPerPage(itemsPerPage);
                    self.itemsPerPage = itemsPerPage;
                }
                self.search = function (dept) {
                    self.emps = srchFormService.search(dept);
                }
                self.updateEmployee = function () {
                    self.emps = srchFormService.updateEmployee();
                }
                self.removeEmployee = function () {
                    self.emps = srchFormService.removeEmployee();
                }
                self.download = srchFormService.download;
                self.reset = srchFormService.reset;

                //self.reset();
            }])

        // Inline edit directive
        .directive('editableField', function () {
            var self = this || {};
            self.link = function (scope, elm, attr, editCtrl) {
                var previousValue;

                editCtrl.edit = function () {
                    editCtrl.editMode = true;
                    previousValue = editCtrl.model;

                    elm.find('input')[0].focus();
                };
                editCtrl.save = function () {
                    editCtrl.editMode = false;
                    scope.$watch(angular.bind(editCtrl, function () {
                        return editCtrl.model;
                    }), function (newVal, oldVal) {
                        if (newVal === oldVal) {
                            console.log('model first time' + newVal);
                            return;
                        }
                        console.log('model updated');
                    });
                    //editCtrl.someCtrlFn({value: editCtrl.model});
                };
                editCtrl.cancel = function () {
                    editCtrl.editMode = false;
                    editCtrl.model = previousValue;
                };
            }
            return {
                scope: {},
                controllerAs: 'editCtrl',
                controller: function () {
                },
                bindToController: {
                    model: '=editableField'
                    //someCtrlFn: '&onSave'
                },
                transclude: true,
                link: self.link,
                templateUrl: '../../html/templates/inline-edit.html'
            };
        })

        //angular.module('myApp.bootstrap')
        //    .getProvider()
        .service('deptService', ['$resource', function ($resource) {
            return $resource('/dept/:dept', {dept: '@_dept'}, {
                update: {
                    method: 'POST' // this method issues a PUT request
                }
            });
        }])

        //angular.module('myApp.bootstrap')
        //    .getProvider()
        .service('srchFormService', ['$state', 'deptService', function ($state, deptService) {
            var self = this;
            self.master = {};
            self.itemsPerPage = 5;
            self.emps = []
            self.selectedEmp = {};
            self.view2b = self.view2b || {};
            self.predicate = 'salary';
            self.reverse = true;

            self.setItemsPerPage = function (itemsPerPage) {
                self.itemsPerPage = itemsPerPage;
            }

            self.setSelectedEmployee = function () {
                angular.forEach(self.emps, function (emp) {
                    if (emp.selected === true) {
                        self.selectedEmp = emp;
                    }
                })
                return self.selectedEmp;
            }

            self.getItemsPerPage = function () {
                return self.itemsPerPage;
            }
            self.getPredicate = function () {
                return self.predicate;
            }
            self.getReverse = function () {
                return self.reverse;
            }

            self.search = function (dept) {
                self.emps = []
                if (dept) {
                    deptService.query({dept: dept})
                        .$promise.then(function (employees) {
                            if (employees) {
                                angular.forEach(employees, function (employee) {
                                    employee.selected = false;
                                    self.emps.push(employee);
                                });
                            }
                        })
                }
                return self.emps;
            }

            self.updateEmployee = function () {
                deptService.update({dept: self.selectedEmp})
                    .$promise
                    .then(function (data) {
                        self.view2b.message = 'Employee updated: ' + data.id
                    }, function (error) {
                        console.log(error);
                        self.view2b.message = 'There is an error updating employee. Please contact customer support.';
                    })
                    .finally(function () {
                        self.reset();
                        $state.go('main.view2b');
                    });
            }

            self.removeEmployee = function () {
                var activeEmps = [];
                angular.forEach(self.emps, function (emp) {
                    if (emp.selected === false) {
                        activeEmps.push(emp);
                    }
                })
                self.emps = activeEmps;
                return self.emps;
            }

            self.order = function (predicate) {
                self.reverse = (self.predicate === predicate) ? !self.reverse : false;
                self.predicate = predicate;
            }

            self.download = function () {
                var data = ["EMP_ID, EMP_NAME, EMP_SALARY, EMP_DEPT" + '\r\n'];
                angular.forEach(self.emps, function (emp) {
                    var row = emp.id + ",";
                    row = row + emp.name + ",";
                    row = row + emp.salary + ",";
                    row = row + emp.department.name + '\r\n';
                    data.push(row);
                });
                var anchor = angular.element('<a/>');
                anchor.attr({
                    href: 'data:attachment/csv;charset=utf-8,' + encodeURI(data),
                    target: '_blank',
                    download: 'employees.csv'
                })[0].click();
            };

            self.reset = function () {
                self.emps = [];
                self.selectedEmp = {};
            };

        }]);
})();