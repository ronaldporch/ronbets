var app = angular.module('CasinoNight.controllers')
app.controller('RegisterController', ['$scope', '$http', '$location', function($scope, $http, $location){
  $scope.user = {}
  $scope.register = function(){
    $http.post('/api/auth/register', $scope.user)
    .then(function(res){
    	console.log(res.data)
    }, function(err){
    	console.log(err.data)
    })
  }
}])