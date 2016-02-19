var app = angular.module('CasinoNight.directives')
app.directive('chat', function(){
	var d = {
		restrict: 'E',
		replace: true,
		templateUrl: "partials/matchView/chat.html",
		scope: {
			url: "=",
			chatHeight: "=",
			chatWidth: "="
		}
	}
	return d
})