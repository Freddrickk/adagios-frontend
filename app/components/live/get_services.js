'use strict';

angular.module('adagios.live')

    .constant('filterSuffixes', { contains: '__contains',
                                  has_fields: '__has_field',
                                  startswith: '__startswith',
                                  endswith: '__endswith',
                                  exists: '__exists',
                                  in: '__in',
                                  isnot: '__isnot',
                                  regex: '__regex'
                                })

    .service('getServices', ['$http', 'filterSuffixes',
        function ($http, filterSuffixes) {
            return function (columns, filters, apiName, additionnalFields) {
                var filtersQuery = '',
                    additionnalQuery = '';

                function createFiltersQuery(filters) {
                    var builtQuery = '';
                    angular.forEach(filters, function (value, key) {
                        var filterType = filterSuffixes[key];
                        angular.forEach(value, function (fieldValues, fieldName) {
                            var filter = fieldName + filterType;
                            angular.forEach(fieldValues, function (_value) {
                                var filterQuery = '&' + filter + '=' + _value;
                                builtQuery += filterQuery;
                            });
                        });
                    });

                    return builtQuery;
                }

                function createAdditionnalQuery(additionnalFields) {
                    var query = '';
                    angular.forEach(additionnalFields, function (value, key) {
                        query += '&' + key + '=' + value;
                    });

                    return query;
                }

                filtersQuery = createFiltersQuery(filters);
                additionnalQuery = createAdditionnalQuery(additionnalFields);

                return $http.get('/rest/status/json/' + apiName + '/?fields=' + columns + filtersQuery + additionnalQuery)
                    .error(function () {
                        throw new Error('getServices : GET Request failed');
                    });
            };
        }])

    // This service is used to count the number of host open problems
    .service('getHostOpenProblems', ['$http', 'getServices',
        function ($http, getServices) {
            var fields = ['state'],
                filters = {},
                apiName = 'hosts',
                additionnalQueryFields = {'acknowledged': 0, 'state': 1};

            return getServices(fields, filters, apiName, additionnalQueryFields)
                .error(function () {
                    throw new Error('getServices : GET Request failed');
                });
        }])

    // This service is used to count the number of service open problems
    .service('getServiceOpenProblems', ['$http', 'getServices',
        function ($http, getServices) {
            var fields = ['state'],
                filters = { "isnot": { "state": [ "0" ], "host_state": [ "2" ] }},
                apiName = 'services',
                additionnalQueryFields = {'acknowledged': 0};

            return getServices(fields, filters, apiName, additionnalQueryFields)
                .error(function () {
                    throw new Error('getServices : GET Request failed');
                });
        }])

    // This service is used to count the number of host problems
    .service('getHostProblems', ['$http', 'getServices',
        function ($http, getServices) {
            var fields = ['state'],
                filters = { 'isnot': {'state': [0]} },
                apiName = 'hosts',
                additionnalQueryFields = {};

            return getServices(fields, filters, apiName, additionnalQueryFields)
                .error(function () {
                    throw new Error('getServices : GET Request failed');
                });
        }])

    // This service is used to count the number of service problems
    .service('getServiceProblems', ['$http', 'getServices',
        function ($http, getServices) {
            var fields = ['state'],
                filters = { 'isnot': {'state': [0]} },
                apiName = 'services',
                additionnalQueryFields = {};

            return getServices(fields, filters, apiName, additionnalQueryFields)
                .error(function () {
                    throw new Error('getServices : GET Request failed');
                });
        }]);
