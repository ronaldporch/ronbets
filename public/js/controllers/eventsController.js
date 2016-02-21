var app = angular.module('CasinoNight.controllers')
app.controller('EventsController', ['$scope', '$http', function($scope, $http){
	$scope.getEvents = function(){
		$http.get('/api/events/')
			.then(function(res){
				$scope.events = res.data.events
			})
	}
	$scope.getEvents()
}])