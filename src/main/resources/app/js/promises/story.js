(function () {
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
})();