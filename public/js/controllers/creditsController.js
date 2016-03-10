var app = angular.module('CasinoNight.controllers')
app.controller('CreditsController', ['$scope', '$http', '$state', 'Auth', function($scope, $http, $state, Auth){
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
	$scope.submitCharge = function(){
		$scope.charging = true;
		$http.post("/api/stripe/credits", {
			charge: $scope.charge,
			user_id: $scope.user.id
		})
			.then(function(res){
				console.log(res)
				$state.go('dashboard');
			})
			.then(function(err){
				$scope.charging = false;
				console.log(err)
			})
	}
}])