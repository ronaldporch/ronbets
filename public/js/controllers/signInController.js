var app = angular.module('CasinoNight.controllers')
app.controller('SignInController', ['Auth', '$scope', '$http', '$location', '$state', function(Auth, $scope, $http, $location, $state){
  $scope.signIn = function(){
    $http.post('/api/auth/sign_in', $scope.user)
      .then(function(res){
        Auth.saveToken(res.data.token)
        $state.go('dashboard')
      })
  }
}])