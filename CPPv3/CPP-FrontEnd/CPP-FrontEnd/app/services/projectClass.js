'use strict';

angular.module('cpp.services').
    factory('ProjectClass', function ($resource) {
        console.log('test luan');
        return $resource(serviceBasePath + "Request/ProjectClass");
    }).
    factory('UpdateProjectClass', function ($resource) {
        return $resource(serviceBasePath + "Response/ProjectClass");
    });
   