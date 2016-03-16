var app = angular.module('CasinoNight.controllers')
app.controller('StreamController', ['$scope', '$state', '$sce', '$location', 'Auth', function($scope, $stateParams, $sce, $location, Auth){
  $scope.isLoggedIn = Auth.isLoggedIn()
  $scope.streamerName = $stateParams.params.streamer;
  $scope.user = Auth.currentUserPayload() ? Auth.currentUserPayload() : {}
  $scope.user.bet = {}

  var server = ($location.$$host == "localhost") ? "localhost:3000" + "/stream" : $location.$$host + "/stream"
    var socket = io(server, {'forceNew': true});

    socket.emit('getStreamInfo', {
        streamer: $scope.streamerName,
        user: $scope.user
    })

    socket.on('playingMatch', function(data){
        $scope.$apply(function(){
            $scope.currentMatch = data[0];
        })
    })

    socket.on('currentParticipants', function(data){
        $scope.$apply(function(){
            $scope.participants = data;
            $scope.participants.forEach(function(value, index, arr){
                if(value.user_id == $scope.user.id){
                    $scope.entry = value
                }
            })
            console.log($scope.participants);
        })
    })

    socket.on('disconnect', function(){
        console.log('disconnect');
    })

    socket.on('startNewMatch', function(data){
        $scope.$apply(function(){
            $scope.currentMatch = data
            $scope.currentBets = [[],[]]
        })
    })

    socket.on('showWinner', function(data){
        $scope.$apply(function(){
            $scope.currentMatch = data
        })
    })

    socket.on('eventEntry', function(data){
        $scope.$apply(function(){
            $scope.user.ante = data[0].ante
            socket.emit('getCurrentBets', {
                match: $scope.currentMatch
            })
            socket.emit('getParticipants', {
                currentEvent: $scope.event,
                streamer: $scope.streamer
            })
        })
    })

    socket.on('remainingTime', function(data){
        $scope.$apply(function(){
            $scope.currentMatch.remaining_time = data.remaining_time
        })
    })
    socket.on('bettingClosed', function(data){
        $scope.$apply(function(){
            $scope.currentMatch = data
        })
    })

    socket.on('currentBets', function(data){
      $scope.$apply(function(){
        $scope.bets = [[],[]]
        data.forEach(function(value, index, arr){
          if(value.user_id == $scope.user.id){
            $scope.user.bet = value
          }
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

    socket.on('openEvents', function(data){
        $scope.$apply(function(){
            data.forEach(function(value, index, arr){
                if(value.active == true){
                    $scope.currentEvent = value
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

    socket.on('streamInfo', function(data){
      $scope.$apply(function(){
        $scope.streamer = data[0]
        $scope.setupStream()
        socket.emit('getOpenEvents', {
          streamer: $scope.streamer,
          updateStatus: "self"
        })
      })
    })

    $scope.$on('$destroy', function(){
        socket.emit('leaveRoom', {
            streamer: $scope.streamer
        })
        socket.disconnect()
        socket.emit('disconnect', {
            streamer: $scope.streamer
        })
    })

    $scope.startBet = function(player_id){
        $scope.user.newBet.player = player_id
    }

    $scope.submitBet = function(){
        $scope.user.newBet.match_id = $scope.currentMatch.id
        $scope.user.newBet.user_id = $scope.user.id
        socket.emit('sendBet', {
            bet: $scope.user.newBet,
            streamer: $scope.streamer,
            event: $scope.currentEvent
        })
        $scope.user.newBet = {}
    }

    $scope.cancelBet = function(){
        $scope.user.newBet = {}
    }

    $scope.setupStream = function(){
        $scope.stream = {
            width: document.getElementById('stream-view').offsetWidth - 30,
            height: (document.getElementById('stream-view').offsetWidth - 30) / 1.777
        }
        var streamServiceUrl = $scope.streamer.stream_service == 'twitch' ? "http://player.twitch.tv/?channel=" : "http://hitbox.tv/#!/embed/"
        var chatServiceUrl = ""
        if($scope.streamer.chat_service == "stream"){
            console.log("stream chat")
            if($scope.streamer.stream_service == "twitch"){
                chatServiceUrl = "http://twitch.tv/" + $scope.streamer.stream_name + "/chat?popout=true"
            }else{
                chatServiceUrl = "http://www.hitbox.tv/embedchat/" + $scope.streamer.stream_name
            }
        }else{
            chatServiceUrl = ""
        }
        $scope.streamUrl = $sce.trustAsResourceUrl(streamServiceUrl +  $scope.streamer.stream_name);
        $scope.chatUrl = $sce.trustAsResourceUrl(chatServiceUrl);
    }
    
    $(window).resize(function(){
        $scope.$apply(function(){
            $scope.stream.width = document.getElementById('stream-view').offsetWidth - 30
            $scope.stream.height = $scope.stream.width / 1.777;
        })
    })
}])