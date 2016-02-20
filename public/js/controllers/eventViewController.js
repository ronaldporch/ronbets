var app = angular.module('CasinoNight.controllers')
app.controller('EventViewController', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams){
	$scope.getEvent = function(){
		$http.get('/api/events/event/' + $stateParams.event_id)
			.then(function(res){
				$scope.event = res.data.events
			}, function(err){
				console.log(err)
			})
	}
	$scope.getEvent()
}])