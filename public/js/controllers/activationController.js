var app = angular.module('CasinoNight.controllers')
app.controller('ActivationController', ['$scope', '$stateParams', '$http', '$location', '$state', 'Auth', function($scope, $stateParams, $http, $location, $state, Auth){
  $scope.server = $location.$$host == "localhost" ? "http://localhost:3000/" : $location.$$host;
  $scope.getUser = function(){
    $scope.user = {}
    $http.get("http://" + $scope.server + '/api/auth/getUser/' + $stateParams.id)
      .then(function(res){
        $scope.user.username = res.data.username
        $scope.user.id = res.data.id
        $scope.user.streamService = "none"
        $scope.user.chatService = "stream"
      })
  }
  $scope.activateUser = function(){
    $http.post("http://" + $scope.server + '/api/auth/activate', $scope.user)
      .then(function(res){
        Auth.saveToken(res.data.token)
        $state.go('dashboard')
      })
  }
  $scope.getUser()
}])