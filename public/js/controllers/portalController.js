var app = angular.module('CasinoNight.portal', ['CasinoNight.authService'])
app.controller('PortalController', ['$scope', 'Auth', '$location', function($scope, Auth, $location){
  console.log($location.$$host)
  var server = $location.$$host == "localhost" ? "localhost:3000/stream" : $location.$$host + "/stream";
  var socket = io("http://" + server)
  $scope.user = Auth.currentUserPayload()
  console.log($scope.user)
  socket.emit('getConnection', {
  	user: $scope.user
  })
  socket.on('latestMatch', function(data){
  	$scope.$apply(function(){
  		$scope.currentMatch = data
  	})
  })
  $scope.players = []

  $scope.submitWinner = function(player_id){
  	socket.emit('submitWinner', {
  		currentMatch: $scope.currentMatch,
  		winner: player_id,
  		stream_name: $scope.user.stream_name
  	})
  }
  $scope.sendNewMatch = function(){
  	$scope.players.forEach(function(player, index, arr){
  		player.odds = 1;
  		player.total = 0;
  	})
    console.log($scope.players)
  	socket.emit('sendNewMatch', {
  		streamer_id: $scope.user.id,
  		stream_name: $scope.user.stream_name,
      streamer: $scope.user.username,
  		players: $scope.players,
  		remaining_time: $scope.remaining_time
  	})
  }
}])