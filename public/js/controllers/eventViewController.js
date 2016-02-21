var app = angular.module('CasinoNight.controllers')
app.controller('EventViewController', ['$scope', '$http', '$stateParams', 'Auth', function($scope, $http, $stateParams, Auth){
	$scope.getEvent = function(){
		$http.get('/api/events/event/' + $stateParams.event_id)
			.then(function(res){
				$scope.event = res.data.events
			}, function(err){
				console.log(err)
			})
	}
	$scope.user = Auth.currentUserPayload()
	if($scope.user){
		$http.get('/api/events/entry/' + $scope.user.id + "/" + $stateParams.event_id)
			.then(function(res){
				$scope.entry = res.data.entry
				console.log($scope.entry)
			})
	}
	$scope.getEvent()
	$scope.isJoining = false
	$scope.showForm = function(){
		$scope.isJoining = !$scope.isJoining
	}
	$scope.submitEntry = function(){
		$scope.entry = {
			event_id: $scope.event.id,
			user_id: $scope.user.id,
			ante: $scope.ante
		}
		$http.post('/api/events/entry', $scope.entry)
			.then(function(res){
				$scope.isJoining = false
				console.log(res.data)
			})
		
	}
	$scope.startEvent = function(){
		$http.get('api/events/active/' + $scope.user.id)
			.then(function(res){
				console.log(res.data.active)
				if(res.data.active > 0){
					console.log("You currently have an active event. Please end that event before starting another.")
				}else{
					$http.post('api/events/start', {
						event_id: $scope.event.id
					})
						.then(function(res){
							$scope.event.active = res.data.event.active
						})
				}
			})
	}
	$scope.endEvent = function(){
		$http.post('api/events/end', {
			event_id: $scope.event.id
		})
			.then(function(res){
				$scope.event.active = res.data.event.active
				$scope.event.complete = res.data.event.complete
			})
	}
	$scope.cancelEntry = function(){
		$http.post('/api/events/entry/cancel', {
			user_id: $scope.user.id,
			event_id: $stateParams.event_id
		})
			.then(function(res){
				$scope.entry = undefined
			})
	}
}])