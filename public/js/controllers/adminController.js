var app = angular.module('CasinoNight.controllers')
app.controller('AdminController', ['$scope', 'Auth', '$rootScope', '$state', function($scope, Auth, $rootScope, $state){
  $scope.user = Auth.currentUserPayload()
  $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams){
    $scope.user = Auth.currentUserPayload()
  })
  $scope.signOut = function(){
    Auth.signOut()
    $state.go('home')
  }
}])