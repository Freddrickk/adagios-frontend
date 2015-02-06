'use strict';

angular.module('adagios.tactical', ['ngRoute',
                                    'adagios.tactical.status_overview',
                                    'adagios.tactical.current_health',
                                    'adagios.tactical.top_alert_producers',
                                    'adagios.table'
                                    ])

    .value('dashboardConfig', {})

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/dashboard', {
            templateUrl: 'dashboard/dashboard.html',
            controller: 'DashboardCtrl'
        });
    }])

    .controller('DashboardCtrl', ['$scope', 'dashboardConfig', function ($scope, dashboardConfig) {
        $scope.dashboardCells = dashboardConfig.cells.join();
        $scope.dashboardApiName = dashboardConfig.apiName;
        $scope.dashboardFilters = dashboardConfig.filters;
    }])

    .run(['readConfig', 'dashboardConfig', function (readConfig, dashboardConfig) {
        dashboardConfig.cells = readConfig.dashboardConfig.cells;
        dashboardConfig.apiName = readConfig.dashboardConfig.apiName;
        dashboardConfig.filters = readConfig.dashboardConfig.filters;
    }]);
