var app = angular.module('CasinoNight.streamDirective', [])
app.directive('stream', function(){
	var d = {
		restrict: 'E',
		replace: true,
		templateUrl: "partials/matchView/stream.html",
		scope: {
			url: "=",
			streamHeight: "=",
			streamWidth: "="
		}
	}
	return d
})