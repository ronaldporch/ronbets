var app = angular.module('CasinoNight.controllers')
app.controller('SettingsController', ['$scope', 'Auth', '$http', '$location', function($scope, Auth, $http, $location){
	$scope.server = $location.$$host == "localhost" ? "localhost:3000" : $location.$$host;
	$scope.getUser = function(){
		$scope.user = Auth.currentUserPayload()
		console.log($scope.user)
	}
	$scope.getUser()
	$scope.updateUser = function(){
		$http.post("http://" + $scope.server + '/api/users/' + $scope.user.id, $scope.user)
			.then(function(res){
				Auth.saveToken(res.data.token)
			})
	}
}])