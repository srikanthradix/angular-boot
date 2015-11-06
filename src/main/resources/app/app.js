(function () {
    'use strict';

    angular.module('myApp', ['ui.router', 'myApp.bootstrap'])

        .config(['$urlRouterProvider', function ($urlRouterProvider) {
            $urlRouterProvider.otherwise('/');
        }])
})();