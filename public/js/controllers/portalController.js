var app = angular.module('CasinoNight.controllers')
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

  $scope.newMatch = {
    players: [],
    remaining_time: undefined,
    game: undefined
  }

  $scope.submitWinner = function(player_id){
  	socket.emit('submitWinner', {
  		currentMatch: $scope.currentMatch,
  		winner: player_id,
  		stream_name: $scope.user.username
  	})
  }
  $scope.startPlaying = function(){
    socket.emit('startPlaying', {
      currentMatch: $scope.currentMatch,
      stream_name: $scope.user.username
    })
  }
  socket.on('showWinner', function(data){
    $scope.$apply(function(){
      $scope.currentMatch = data
    })
  })
  socket.on('playingMatch', function(data){
    $scope.$apply(function(){
      $scope.currentMatch = data
    })
  })
  socket.on('bettingClosed', function(data){
    $scope.$apply(function(){
          $scope.currentMatch = data
      })
  })
  $scope.sendNewMatch = function(){
  	$scope.newMatch.players.forEach(function(player, index, arr){
  		player.odds = 1;
  		player.total = 0;
  	})
    console.log($scope.players)
  	socket.emit('sendNewMatch', {
  		streamer_id: $scope.user.id,
  		stream_name: $scope.user.username,
      streamer: $scope.user.username,
  		players: $scope.newMatch.players,
  		remaining_time: $scope.newMatch.remaining_time
  	})
  }
}])