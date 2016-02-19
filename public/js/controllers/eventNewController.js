var app = angular.module('CasinoNight.controllers')
app.controller('NewEventController', ['$http', '$scope', function($http, $scope){
	//MglOkMH3lcBjnvKlGcthufy3A4aEhHXFugxbMeRm
	https://dada5714:MglOkMH3lcBjnvKlGcthufy3A4aEhHXFugxbMeRm@api.challonge.com/v1/tournaments.json
	var apiKey = "MglOkMH3lcBjnvKlGcthufy3A4aEhHXFugxbMeRm"
	var userName = "dada5714"
	var challongeUrl = "http://dada5714:MglOkMH3lcBjnvKlGcthufy3A4aEhHXFugxbMeRm@api.challonge.com/v1/"
	$http.get("/api/challonge/tournaments?apiKey=" + apiKey + "&userName=" + userName)
		.then(function(res){
			console.log(res.data)
		})
}])