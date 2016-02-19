var app = angular.module('CasinoNight.controllers')
app.controller('RegisterController', ['$scope', '$http', '$location', function($scope, $http, $location){
  $scope.user = {}
  $scope.register = function(){
    $scope.server = $location.$$host == "localhost" ? "http://localhost:3000/" : $location.$$host;
    $http.post("http://" + $scope.server + '/api/auth/register', $scope.user)
    .then(function(res){
    	console.log(res.data)
    }, function(err){
    	console.log(err.data)
    })

  }
}])