var app = angular.module('CasinoNight.services')
app.factory('Auth', ['$window', function($window){
	var o = {}
	o.saveToken = function(token){
		$window.localStorage['casinoNight-token'] = token
	}
	o.getToken = function(){
		return $window.localStorage['casinoNight-token']
	}
	o.isLoggedIn = function(){
		var token = this.getToken();
		if(token){
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return payload.exp > Date.now() / 1000;
		}else{
			return false;
		}
	}
	o.signOut = function(){
		$window.localStorage.removeItem('casinoNight-token')
	}
	o.currentUser = function(){
		if(this.isLoggedIn()){
			var token = this.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return payload.username;
		}
	}
	o.currentUserPayload = function(){
		if(this.isLoggedIn()){
			var token = this.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return payload;
		}
	}
	return o
}])