var app = angular.module('CasinoNight.controllers')
app.controller('PortalController', ['$scope', 'Auth', '$location', function($scope, Auth, $location){
  console.log($location.$$host)
  var server = $location.$$host == "localhost" ? "localhost:3000/stream" : $location.$$host + "/stream";
  var socket = io("http://" + server)
  $scope.user = Auth.currentUserPayload()
  console.log($scope.user)

  socket.emit('getStreamInfo', {
    streamer: $scope.user.username,
    user: $scope.user
  })

  socket.on('currentBets', function(data){
    $scope.$apply(function(){
      $scope.bets = [[],[]]
      data.forEach(function(value, index, arr){
        if(value.player_id == 1){
            $scope.bets[0].push(value)
        }else if(value.player_id == 2){
          $scope.bets[1].push(value)
        }
      })
    })
  })

socket.on('matches', function(data){
    $scope.$apply(function(){
        $scope.currentMatch = data[0]
        console.log($scope.currentMatch)
        socket.emit('getCurrentBets', {
            currentMatch: $scope.currentMatch,
            updateStatus: 'self'
        })
    })
})

socket.on('streamInfo', function(data){
  $scope.$apply(function(){
    $scope.streamer = data[0]
    socket.emit('getOpenEvents', {
      streamer: $scope.streamer,
      updateStatus: "self"
    })
  })
})

socket.on('openEvents', function(data){
    $scope.$apply(function(){
        data.forEach(function(value, index, arr){
            if(value.active == true){
                $scope.currentEvent = value
                console.log($scope.currentEvent)
            }
        })
    })
    socket.emit('getMatches', {
        currentEvent: $scope.currentEvent,
        streamer: $scope.streamer,
        updateStatus: 'self'
    })
    socket.emit('getParticipants', {
        currentEvent: $scope.currentEvent,
        updateStatus: 'self'
    })
})

  socket.on('currentMatch', function(data){
  	$scope.$apply(function(){
  		$scope.currentMatch = data.match
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
  		stream_name: $scope.user.username,
      event_id: $scope.event.id,
      event: $scope.event
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
      $scope.currentMatch = data[0]
    })
  })
  socket.on('playingMatch', function(data){
    $scope.$apply(function(){
      $scope.currentMatch = data[0]
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
      event_id: $scope.currentEvent.id,
  		remaining_time: $scope.newMatch.remaining_time
  	})
  }
}])