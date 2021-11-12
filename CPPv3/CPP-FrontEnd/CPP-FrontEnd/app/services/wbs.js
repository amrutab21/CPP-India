'use strict';

angular.module('cpp.services').
    factory('WbsService', function ($resource, $cacheFactory) {
        return {
            getWBS: function (uID, orgId, pgmId, pgmEltId, projId, searchText, allData) {
                //var cache;
                //if ($cacheFactory.get('wbs')) {
                //   cache = $cacheFactory.get('wbs');
                //} else {
                //    cache = $cacheFactory('wbs');
                //}

                return $resource(serviceBasePath + "Request/WBS/" + uID + "/" + orgId + "/" + pgmId + "/" + pgmEltId + "/" + projId + "/null/null/null/null/null/" + searchText + "/" + allData, {},{
                    'get': { method: 'GET', cache: false },
                    'query': { method: 'GET', cache: false, isArray: true }
                });
            }
        };
    });
