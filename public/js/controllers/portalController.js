var app = angular.module('CasinoNight.portal', [])
app.controller('PortalController', ['$scope', function($scope){
  var server = "http://localhost:3000/stream";
  var socket = io(server)
  $scope.user = {
  	id: 1,
  	stream_name: "dada5714"
  }
  
  socket.emit('getConnection', {
  	user: $scope.user
  })
  socket.on('latestMatch', function(data){
  	$scope.$apply(function(){
  		$scope.currentMatch = data
  	})
  })

  $scope.submitWinner = function(player_id){
  	socket.emit('submitWinner', {
  		currentMatch: $scope.currentMatch,
  		winner: player_id,
  		stream_name: $scope.user.stream_name
  	})
  }
  $scope.sendNewMatch = function(){
  	$scope.currentMatch.players.forEach(function(player, index, arr){
  		player.odds = 1;
  		player.total = 0;
  	})
  	socket.emit('sendNewMatch', {
  		streamer_id: $scope.user.id,
  		stream_name: $scope.user.stream_name,
  		players: [$scope.currentMatch.players[0], $scope.currentMatch.players[1]],
  		remaining_time: $scope.currentMatch.remaining_time
  	})
  }
}])