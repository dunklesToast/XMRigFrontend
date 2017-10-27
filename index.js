'use strict';

var xmrig = angular.module('xmrigstats', ['ngMaterial']);
xmrig.controller('MainController', function ($scope, $http, $mdDialog) {
    var x;
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

    $scope.update = function () {
        $http.get(localStorage.getItem('url') + ':' + localStorage.getItem('port'), {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('auth')
            }
        }).then(function (data) {
            var d = new Date();
            d.setTime(d.getTime() - data.data.connection.uptime * 1000);
            $scope.res = data.data;
            $scope.res.started = getDate(d);
        }).catch(function (err) {
            console.log(err);
            $mdDialog.show($mdDialog.alert().clickOutsideToClose(true).title('Error').textContent('We could not reach a Miner at ' + err.config.url + '. Sleeping for 60 Seconds!').ok('Damn!'));
            clearInterval(x);
            interval(60*1000);
        });
    };
    $scope.update();
    interval();
    function interval(value) {
        console.log('Updating: ' + localStorage.getItem('update')*1000);
        x = setInterval(function () {
            $scope.update();
        }, value || localStorage.getItem('update')*1000 || 5000);
    }
    $scope.settings = function (ev) {
        $mdDialog.show({
            controller: SettingsController,
            templateUrl: 'tmpl/settings.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: false
        });
    };

    function SettingsController($scope, $mdDialog) {
        $scope.rig = localStorage;
        $scope.cancel = function () {
            $mdDialog.hide();
        };
        $scope.save = function () {
            localStorage.setItem('url', $scope.rig.url || null);
            localStorage.setItem('port', $scope.rig.port || null);
            localStorage.setItem('auth', $scope.rig.auth || null);
            localStorage.setItem('update', $scope.rig.update || 5);
            clearInterval(x);
            interval();
            $mdDialog.hide();
        };
    }

    function getDate(d) {
        return ('0' + d.getDate()).toString().substr(-2) + '.' + ('0' + (d.getMonth() + 1)).toString().substr(-2) + '.' + d.getFullYear() + ' / ' + ('0' + d.getHours()).toString().substr(-2) + ':' + ('0' + d.getMinutes()).toString().substr(-2) + ':' + ('0' + d.getSeconds()).toString().substr(-2);
    }
}).config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default').primaryPalette('orange').accentPalette('pink').dark();
});