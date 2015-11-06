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

})();