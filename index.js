'use strict';

var xmrig = angular.module('xmrigstats', ['ngMaterial']);
var x;
xmrig.controller('MainController', function ($scope, $http, $mdDialog, $mdSidenav) {
    $scope.safeApply = function (fn) {
        var phase = this.$root.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            if (fn && typeof fn === 'function') {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    $scope.rigs = JSON.parse(localStorage.getItem('rigs')) || [];
    $scope.currentRig = 0;
    if (JSON.parse(localStorage.getItem('rigs'))) {
        $scope.type = JSON.parse(localStorage.getItem('rigs'))[$scope.currentRig];
    }

    $scope.toggleMenu = function () {
        $mdSidenav('menu').toggle();
    };

    function update() {
        try {
            var json = ($scope.rigs[$scope.currentRig]);
            if (json) {
                console.log('updating');
                $http.get(json.url + ':' + json.port + ((json.type === 'proxy') ? '/1/summary' : '/')).then(function (data) {
                    if (json.type === 'proxy') {
                        $http.get(json.url + ':' + json.port + '/1/workers').then(function (w) {
                            for (var i = 0; i < w.data.workers.length; i++) {
                                w.data.workers[i][7] = $scope.date(new Date(w.data.workers[i][7]));
                            }
                            $scope.workers = w.data.workers;
                        });
                        data.data.uptime = $scope.date(new Date(new Date() - data.data.uptime));
                    }
                    $scope.res = data.data;
                    clearTimeout(x);
                    x = setTimeout(update, 5000);
                });
            } else {
                if (x) clearTimeout(x);
                setTimeout(update, 60000);
                throw new Error('No Miner saved');
            }
        } catch (e) {
            console.error(e);
            $mdDialog.show($mdDialog.alert().clickOutsideToClose(true).title('Error').textContent('We could not reach the Miner and encountered an Error: ' + e.message + '. Sleeping 60s').ok('Damn!'));
        }
    }

    update();

    $scope.settings = function (ev) {
        $mdDialog.show({
            controller: SettingsController,
            templateUrl: 'tmpl/add.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: true
        }).then(function () {
            $scope.rigs = JSON.parse(localStorage.getItem('rigs'));
        });
    };

    $scope.remove = function (ev) {
        $mdDialog.show({
            controller: RemoveController,
            templateUrl: 'tmpl/remove.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: true
        }).then(function () {
            $scope.rigs = JSON.parse(localStorage.getItem('rigs'));
        });
    };

    $scope.close = function (number) {
        console.log('Changing to ' + $scope.rigs[number].name);
        $scope.currentRig = number;
        $scope.type = JSON.parse(localStorage.getItem('rigs'))[$scope.currentRig].type;
        console.log($scope.type);
        update();
        $mdSidenav('menu').close();
    };

    $scope.date = function (d) {
        return ('0' + d.getDate()).toString().substr(-2) + '.' + ('0' + (d.getMonth() + 1)).toString().substr(-2) + '.' + d.getFullYear() + ' / ' + ('0' + d.getHours()).toString().substr(-2) + ':' + ('0' + d.getMinutes()).toString().substr(-2) + ':' + ('0' + d.getSeconds()).toString().substr(-2);
    };

}).config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default').primaryPalette('orange').accentPalette('pink').dark();
});

function SettingsController($scope, $mdDialog) {
    $scope.cancel = function () {
        $mdDialog.hide();
    };
    $scope.save = function () {
        var current = JSON.parse(localStorage.getItem('rigs')) || [];
        current.push({
            url: $scope.rig.url,
            type: $scope.rig.type,
            port: $scope.rig.port,
            auth: $scope.rig.auth,
            name: $scope.rig.name
        });
        localStorage.setItem('rigs', JSON.stringify(current));
        $mdDialog.hide();
    };
}

function RemoveController($scope, $mdDialog) {
    $scope.rigs = JSON.parse(localStorage.getItem('rigs')) || [];
    $scope.cancel = function () {
        $mdDialog.hide();
    };
    $scope.removeRig = function (i) {
        console.log(JSON.stringify($scope.rigs.splice(i, 1)));
        localStorage.clear();
        localStorage.setItem('rigs', JSON.stringify($scope.rigs.splice(i, 1)));
    };
}