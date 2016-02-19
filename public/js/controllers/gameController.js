var app = angular.module('CasinoNight.controllers')
app.controller('GameController', ['$scope', '$stateParams', function($scope, $stateParams){
  $scope.game = $stateParams.game.replace(/-/g, " ")
}])