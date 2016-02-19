var app = angular.module('CasinoNight.controllers')
app.controller('SignInController', ['Auth', '$scope', '$http', '$location', '$state', function(Auth, $scope, $http, $location, $state){
  $scope.server = ($location.$$host == "localhost") ? "localhost:3000" : $location.$$host;
  $scope.signIn = function(){
    $http.post("http://" + $scope.server + '/api/auth/sign_in', $scope.user)
      .then(function(res){
        Auth.saveToken(res.data.token)
        $state.go('dashboard')
      })
  }
}])