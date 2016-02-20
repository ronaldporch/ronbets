var app = angular.module('CasinoNight.controllers')
app.controller('NewEventController', ['$http', '$scope', 'Auth', '$state', function($http, $scope, Auth, $state){
	$scope.event = {}
	$scope.event.streamer_id = Auth.currentUserPayload().id
	$scope.event.players = [
		{},
		{}
	]
	$scope.addPlayer = function(){
		$scope.event.players.push({})
	}
	$scope.submitEvent = function(){
		$http.post('/api/events/', $scope.event)
		.then(function(res){
			console.log(res.data)
			$state.go('dashboard')
		})
	}
}])