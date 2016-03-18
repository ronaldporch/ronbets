var app = angular.module('CasinoNight.controllers')
app.controller('CreditsController', ['$scope', '$http', '$state', '$state', 'Auth', function($scope, $http, $state, $stateParams, Auth){
	$scope.streamer = $stateParams.params.streamer;
	$scope.user = Auth.currentUserPayload()
	$scope.charging = false;
	$scope.charge = {
		amount: "500",
	  	currency: "usd",
	  	source: {
	  		exp_month: undefined,
	  		exp_year: undefined,
	  		number: undefined,
	  		object: "card",
	  		cvc: undefined
	  	}, // obtained with Stripe.js
	  	description: "Charge for CasinoNight"
	}
	$scope.setEvent = function(currrentEvent){
		$scope.event = currrentEvent
	}

	$scope.submitCharge = function(){
		console.log($scope.currentEvent)
		$scope.charging = true;
		$http.post("/api/stripe/credits", {
			charge: $scope.charge,
			user_id: $scope.user.id,
			streamer_id: $scope.currentEvent.streamer_id,
			event_id: $scope.currentEvent.id
		})
			.then(function(res){
				console.log(res)
				$('#rechargeModal').modal('hide')
				$state.reload();
			})
			.then(function(err){
				$scope.charging = false;
				console.log(err)
			})
	}
}])