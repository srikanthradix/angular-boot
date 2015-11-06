/**
 * Created by Srikanth on 8/27/2015.
 */
(function () {
    'use strict';

    var app = angular.module('myApp.bootstrap', ['ui.router',
        'myApp.constants',
        'myApp.functions',
        'myApp.version',
        'myApp.newEmplForm',
        'myApp.searchEmplForm'
    ])

        .config(["NAV", '$stateProvider', '$urlRouterProvider',
            function (NAV, $stateProvider, $urlRouterProvider) {

                $stateProvider
                    .state(NAV.NEW_EMP.PAGE, {
                        url: '/',
                        views: {
                            '': {
                                templateUrl: 'html/home/home.html'
                            },
                            'nav-menu@home': {
                                templateUrl: 'html/nav/menu.html',
                                controllerAs: 'tabC',
                                controller: 'TabController'
                            },
                            'body@home': {
                                templateUrl: 'html/forms/empl/new/newEmplForm.html',
                                controllerAs: 'nefC',
                                controller: 'NewEmplCtrl'
                            }
                        }
                    })
                    .state(NAV.LIST_EMP.PAGE, {
                        url: '/list-employees',
                        views: {
                            'body@home': {
                                templateUrl: 'html/forms/empl/search/searchAndUpdateEmplForm.html',
                                controllerAs: 'srchC',
                                controller: 'searchEmplCtrl'
                            }
                        }
                    })
                    .state(NAV.SCOPE, {
                        url: '/scopes',
                        views: {
                            'body@home': {
                                templateUrl: 'html/scope/scope.html',
                                controller: 'scopeCtrl',
                            }
                        }
                    })
                    .state(NAV.PROMISES, {
                        url: '/promises',
                        views: {
                            'body@home': {
                                templateUrl: 'html/promises/story.html',
                                controllerAs: 'storyC',
                                controller: 'storyCtrl',
                            }
                        }
                    })

                $urlRouterProvider.otherwise("/");
            }])

        .controller('TabController', ['NAV', '$scope', '$state', function (NAV, $scope, $state) {
            var self = this;
            self.tabs = [
                {
                    route: '', title: "Forms",
                    dropdown: [
                        {route: NAV.NEW_EMP.ID, title: "NewForm"},
                        {route: NAV.LIST_EMP.SEARCH.PAGE, title: "SearchForm"},
                    ]
                },
                {route: NAV.SCOPE, title: "Scope"},
                {route: NAV.PROMISES, title: "Promises"},
            ];

            self.go = function (route) {
                if (route) {
                    $state.go(route);
                }
            };

            self.active = function (route) {
                return $state.is(route);
            };
        }]);

})();;(function () {
    'use strict';

    angular.module('myApp.version', [])

        .directive('appVer', ['version', function (version) {
            return function (scope, elm, attrs) {
                elm.text(version);
            };
        }])

        .filter('interpolated', ['version', function (version) {
            return function (text) {
                return String(text).replace(/\%VERSION\%/mg, version);
            };
        }])

        .filter('capitalize', [function () {
            return function (text) {
                if (!text) {
                    return ' ';
                }
                return String(text).toUpperCase();
            }
        }])

        .value('version', '0.6');
})();;(function () {
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
})();;/**
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
})();;/**
 * Created by Srikanth on 11/1/2015.
 */
(function () {
    'use strict';
    angular.module('myApp.constants', [])

        .constant("NAV", {
            //"HOME": "home",
            "SCOPE": "home.scope",
            "NEW_EMP": {
                "PAGE": "home",
                "ID": "home.id",
                "PROFILE": "home.profile"
            },
            "LIST_EMP": {
                PAGE: "home.list_emp",
                SEARCH: {
                    PAGE: "home.list_emp.search",
                    CRITERIA: "criteria@home.list_emp.search",
                    RESULTS: "results@home.list_emp.search",
                    FOOTER: "footer@home.list_emp.search"
                },
                UPDATE: "home.list_emp.update"
            },
            "PROMISES": "home.promises"
        })
})();
;/**
 * Created by Srikanth on 8/24/2015.
 */
(function () {
    'use strict';

    angular.module('myApp.functions', [])

        .run(['$rootScope', function ($rootScope) {
            $rootScope.doubleVal = function (val) {
                if (!val) {
                    return 0;
                } else {
                    return val * 2;
                }
            }
        }])

//    provider must define a $get method where we can instantiate objects.
//    Providers are the only service you can pass into your .config() function.
//     Use a provider when you want to provide module-wide configuration for your service object before making it available.
//    interceptor to log at different life-cycle stages of http request/response.
        .provider('httpInterceptorProvider', ['$httpProvider', function ($httpProvider) {

            $httpProvider.interceptors.push(['$q', function ($q) {
                return {
                    'request': function (config) {
                        console.log('http request sent..');
                        return config;
                    },

                    'requestError': function (rejection) {
                        console.log('http request rejected...' + rejection);
                        return $q.reject(rejection);
                    },

                    'response': function (response) {
                        console.log('http response received...');
                        return response;
                    },

                    'responseError': function (rejection) {
                        console.log('http response rejected...' + rejection);
                        return $q.reject(rejection);
                    }
                }
            }])

            this.$get = function () {
                return $httpProvider;
            }

        }])

        //$q - A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
        .factory('responseErrorRecovery', ['$q', '$injector', function ($q, $injector) {
            var retries = 0;
            var errorRecovery = {
                'responseError': function (response) {
                    if (retries === 0) {
                        retries += 1;
                        var $http = $injector.get('$http');
                        return $http(response.config);
                    } else {
                        console.log('Retried maximum number of times:' + retries);
                        return $q.reject(response);
                    }
                }
            }
            return errorRecovery;
        }])

        //interceptor to recover response
        .provider('responseRecovery', ['$httpProvider', function ($httpProvider) {
            $httpProvider.interceptors.push('responseErrorRecovery');

            this.$get = function () {
                return $httpProvider;
            }
        }])

        .controller('responseRecoveryController', ['$http', function ($http) {
            return $http.get('static/weather_report.json')
                .then(function (response) {
                    console.log('response recovered');
                    return response;
                }), function (error) {
                console.log('response recovery failed');
                return error;
            }
        }])

        .service('familyService', ['$http', '$cacheFactory', '$q', function ($http, $cacheFactory, $q) {
            var self = this;
            var url = 'static/family.json';
            var familyCache = $cacheFactory('familyCache');

            self.getFamily = function () {
                var family = familyCache.get('familyData');
                return $q(function (resolve, reject) {
                    if (!family) {
                        $http.get(url)
                            .then(function (response) {
                                if (typeof response.data === 'object') {
                                    familyCache.put('familyData', response.data);
                                    resolve(response.data);
                                } else {
                                    reject('Not an object');
                                }
                            }, function (error) {
                                reject(error);
                            })
                    } else {
                        resolve(family);
                    }
                });
            }
        }])

        .service('mapDataService', ['$http', '$cacheFactory', '$q', function ($http, $cacheFactory, $q) {
            var self = this;
            var url = 'static/USA.geo.json';
            var mapCache = $cacheFactory('mapCache');

            self.getDataForUSAMap = function () {
                var dataForUSAMap = mapCache.get('dataForUSAMap');
                return $q(function (resolve, reject) {
                    if (!dataForUSAMap) {
                        $http.get(url)
                            .then(function (response) {
                                if (typeof response.data === 'object') {
                                    mapCache.put('dataForUSAMap', response.data);
                                    resolve(response.data);
                                } else {
                                    reject('Not an object');
                                }
                            }, function (error) {
                                reject(error);
                            })
                    } else {
                        resolve(dataForUSAMap);
                    }
                });
            };
        }])

        //lazy initialization
        .factory('friendsFactory', ['$http', '$cacheFactory', '$q', '$timeout', function ($http, $cacheFactory, $q, $timeout) {
            var url = 'static/friends.json';
            var friendsCache = $cacheFactory('friendsCache');

            return {
                getFriends: function () {
                    var friends = friendsCache.get('friends');

                    return $q(function (resolve, reject) {
                        if (!friends) {
//                        $timeout(function () {
                            $http.get(url)
                                .then(function (response) {
                                    if (typeof response.data === 'object') {
                                        friendsCache.put('friends', response.data);
                                        resolve(response.data);
                                    } else {
                                        reject('Not an object');
                                    }
                                }, function (response) {
                                    reject(response.data);
                                });
//                        }, 500)
                        } else {
                            resolve(friends);
                        }
                    });
                }
            }
        }])

        //initialized with new
        .service('weatherService', ['$http', '$q', '$timeout', '$cacheFactory', function ($http, $q, $timeout, $cacheFactory) {
            var self = this;

            var url = 'static/weather_report.json';
            var weatherReportCache = $cacheFactory('weatherReportCache');

            self.getWeather = function () {
                var weatherReport = weatherReportCache.get('weatherReport');
                return $q(function (resolve, reject) {
                    if (!weatherReport) {
                        $timeout(function () {
                            $http.get(url)
                                .then(function (response) {
                                    if (response) {
                                        weatherReportCache.put('weatherReport', response.data);
                                        resolve(response.data);
                                    } else {
                                        reject('Not an object');
                                    }
                                }, function (error) {
                                    reject(error);
                                })
                        }, 250);
                    } else {
                        resolve(weatherReport);
                    }
                });
            }
        }])
})();
;(function () {
    'use strict';
    //all of them should return to display
    angular.module('myApp.bootstrap')
        .service('storyService', ['$q', '$http', '$timeout', 'http_defaults', function ($q, $http, $timeout, http_defaults) {
            var self = this;
            var promises = [];

            self.getText = function (urls) {
                angular.forEach(urls, function (url) {
                    var promise =
                        $http({
                            url: 'static/story/' + url + '.json',
                            method: 'GET',
                            timeout: 5000
                        }, http_defaults);
                    promises.push(promise);
                })
                return $q.all(promises);
            }
        }])

        //some of them which returned first are displayed
        .service('storyServiceUsingMap', ['$q', '$http', '$timeout', /*'http_defaults',*/ function ($q, $http, $timeout /*,http_defaults*/) {
            var self = this;
            self.getText = function (urls) {
                var promises = urls.map(function (chapter) {
                    return $http({
                            url: 'static/story/' + chapter + '.json',
                            method: 'GET',
                            timeout: 5000
                        }
                        //http_defaults
                    );
                });
                return $q.all(promises);
            }
        }])

        .controller('storyCtrl', ['storyService', 'storyServiceUsingMap', function (storyService, storyServiceUsingMap) {
            var self = this;
            self.chapters = [];
            var firstChapters = ['chapter-1', 'chapter-2', 'chapter-3'];
            storyService.getText(firstChapters)
                .then(function (responses) {
                    self.chapters.push(responses[0].data);
                    self.chapters.push(responses[1].data);
                    self.chapters.push(responses[2].data);
                })

            var lastChapters = ['chapter-4', 'chapter-5'];
            storyServiceUsingMap.getText(lastChapters)
                .then(function (responses) {
                    self.chapters.push(responses[0].data);
                    self.chapters.push(responses[1].data);
                })
        }])

        .value('http_defaults', {
            timeout: 2000
        })
})();;(function () {
    'use strict';
    angular.module('myApp.bootstrap')
        .controller('scopeCtrl', ['$scope', function ($scope) {
            $scope.callHome = function (msg) {
                alert(msg);
            }

            $scope.ctrlFlavor = 'blackberry'

        }])

//    .directive("phone", function () {
//	  return {
//	    scope: {
//	      dial: "&"
//	    },
//	    template: '<input type="button" value="Call home!" ng-click="dial()">',
//	  };
//	})

        .directive("phone", function () {
            return {
                scope: {
                    dial: "&"
                },
                template: '<input type="text" ng-model="value">' +
                '<input type="button" value="Call home!" ng-click="dial({sendmsg:value})">'
            };
        })

//    .directive("drink", function () {
//	  return {
//	    scope: {},
//	    template: '<div>{{ flavor }}</div>',
//	    link: function (scope, element, attrs) {
//	      scope.flavor = attrs.flavor;
//	    }
//	  };
//	})

        .directive("drink", function () {
            return {
                scope: {
                    flavor: "@"
                },
                template: '<div>{{flavor}}</div>'
            };
        })

        .directive("drinkCtrlFlavor", function () {
            return {
                scope: {
                    flavor: "="
                },
                template: '<input type="text" ng-model="flavor">'
            };
        })

        .directive("clock", function () {
            return {
                scope: {
                    timezone: '@'
                },
                template: "<div>12:00pm {{timezone}}</div>"
            };
        })

        .directive("panel", function () {
            return {
                restrict: 'E',
                transclude: true,
                scope: {
                    title: '@'
                },
                template: '<div style="border: 3px solid #000000">' +
                '<div class="alert-box">{{title}}</div>' +
                '<div ng-transclude></div>' +
                '</div>'
            }
        })

        .directive("tasksWithTransclude", function () {
            return {
                restrict: 'E',
                transclude: true,
                //replace: true,
                scope: {
                    tasks: '='
                },
                controller: function ($scope) {
                    $scope.addTask = function () {
                        if (!$scope.tasks) {
                            $scope.tasks = []
                        }
                        $scope.tasks.push({
                            title1: $scope.title
                        });
                    }
                },
                template: '<div><input type="text" ng-model="title">' +
                '<button ng-click="addTask()">Add Task</button>' +
                '<div><ng-transclude></ng-transclude></div>' +
                '</div></div>'
            }
        })

        //custom form controls for contenteditable
        .directive('contenteditable', function () {
            return {
                require: 'ngModel',
                link: function (scope, elm, attrs, ctrl) {
                    //view -> model
                    elm.on('blur', function () {
                        ctrl.$setViewValue(elm.html());
                    });

                    //model -> view
                    ctrl.$render = function () {
                        elm.html(ctrl.$viewValue);
                    };

                    //local initial value from dom to model
                    ctrl.$setViewValue(elm.html());
                }
            }
        })
})();;(function () {
    'use strict';
    function dependencies() {
        var definition =
        {
            resolver: ['$q', '$rootScope', function ($q, $rootScope) {
                var deferred = $q.defer();

                require(dependencies, function () {
                    $rootScope.$apply(function () {
                        deferred.resolve();
                    });
                });

                return deferred.promise;
            }]
        };

        return definition;
    };
})();;(function () {
    'use strict';

    angular.module('myApp', ['ui.router', 'myApp.bootstrap'])

        .config(['$urlRouterProvider', function ($urlRouterProvider) {
            $urlRouterProvider.otherwise('/');
        }])
})();