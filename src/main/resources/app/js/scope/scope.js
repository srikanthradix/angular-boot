(function () {
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
})();