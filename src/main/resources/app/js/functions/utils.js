/**
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
