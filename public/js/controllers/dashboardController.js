var app = angular.module('CasinoNight.controllers')
app.controller('DashboardController', ['$scope', '$http', 'Auth', function($scope, $http, Auth){
	$scope.user = Auth.currentUserPayload()
	$scope.getEvents = function(){
		$http.get('/api/events/streamer/' + $scope.user.id)
			.then(function(res){
				$scope.events = res.data.events
			})
	}
	$scope.getEvents()
}])