var app = angular.module('CasinoNight.controllers')
app.controller('PortalController', ['$scope', 'Auth', '$location', function($scope, Auth, $location){
  var socket = io("/stream")
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
        $scope.matches = data
        console.log($scope.currentMatch)
        if($scope.currentMatch){
          socket.emit('getCurrentBets', {
            currentMatch: $scope.currentMatch,
            updateStatus: 'self'
          })
        }
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
        console.log(data)
        var generalBet;
          $scope.currentEvent = undefined
          data.forEach(function(value, index, arr){
              if(value.active == true){
                  $scope.currentEvent = value
              }
              if(value.general == true){
                generalBet = value
              }
          })
          if($scope.currentEvent == undefined){
            $scope.currentEvent = generalBet
          }
          $scope.events = data
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

  socket.on('startNewMatch', function(data){
    $scope.$apply(function(){
        $scope.matches.unshift(data)
        if($scope.matches.length > 10){
          $scope.matches.pop()
        }
        $scope.currentMatch = data
        $scope.bets = [[],[]]
        $scope.user.bet = undefined
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
      event_id: $scope.currentEvent.id,
      event: $scope.currentEvent
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