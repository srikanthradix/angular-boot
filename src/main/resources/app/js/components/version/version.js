(function () {
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
})();