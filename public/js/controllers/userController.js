var app = angular.module('CasinoNight.controllers')
app.controller('UserController', ['$scope', '$stateParams', function($scope, $stateParams){
  $scope.user = $stateParams.user
}])