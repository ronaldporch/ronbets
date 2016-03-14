var app = angular.module('CasinoNight.controllers')
app.controller('StreamController', ['$scope', '$state', '$sce', '$location', 'Auth', function($scope, $stateParams, $sce, $location, Auth){
  $scope.isLoggedIn = Auth.isLoggedIn()
  $scope.streamer = $stateParams.params.streamer;
  $scope.user = Auth.currentUserPayload() ? Auth.currentUserPayload() : {}
  $scope.user.bet = {}

  var server = ($location.$$host == "localhost") ? "localhost:3000" + "/stream" : $location.$$host + "/stream"
    var socket = io(server, {'forceNew': true});

    socket.emit('getStreamInfo', {
        streamer: $scope.streamer,
        user: $scope.user
    })
    socket.on('playingMatch', function(data){
        $scope.$apply(function(){
            $scope.currentMatch = data;
        })
    })
    socket.on('currentUsers', function(data){
        $scope.$apply(function(){
            $scope.participants = data.participants;
            console.log($scope.participants);
        })
    })
    socket.on('currentEventWallet', function(data){
        $scope.$apply(function(){
            if(data.inEvent){
                $scope.user.wallet = data.ante
                $scope.user.inEvent = true
            }else{
                $scope.user.wallet = "$0.00"
                $scope.user.inEvent = false
            }
        }) 
    })
    socket.on('disconnect', function(){
        console.log('disconnect');
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
        $scope.user.bet.player = player_id
    }
    socket.on('startNewMatch', function(data){
        $scope.$apply(function(){
            $scope.currentMatch = data
            $scope.currentBets = [[],[]]
            $scope.user.hasBet = false;
        })
    })
    socket.on('showWinner', function(data){
        $scope.$apply(function(){
            $scope.currentMatch = data
        })
        socket.emit('getUserInfo', {
            user: $scope.user.id
        })
    })
    if(Auth.isLoggedIn()){
        socket.emit('getUserInfo', {
            user: $scope.user.id
        })
        socket.on('sendUserInfo', function(data){
            $scope.$apply(function(){
                //$scope.user.wallet = data.wallet
            })
        })
    }
    socket.on('checkForEntryUpdates', function(){
      socket.emit('getEventEntry', {
        event: $scope.event,
        user: $scope.user
      })
    })
    socket.on('checkForWalletUpdates', function(){
      socket.emit('getWallet', {
        user: $scope.user
      })
    })
    socket.on('eventEntry', function(data){
        $scope.$apply(function(){
            if(data.entry){
              $scope.user.inEvent = true
            }
            $scope.user.wallet = data.entry.ante
        })
    })
    socket.on('wallet', function(data){
        $scope.$apply(function(){
            $scope.user.wallet = data.user.wallet
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
        $scope.currentBets = [[],[]]
        data.bets.forEach(function(value, index, ar){
          if(value.user_id == $scope.user.id){
            $scope.user.hasBet = true
          }
          if(value.player_id == 1){
            $scope.currentBets[0].push(value)
          }else if(value.player_id == 2){
            $scope.currentBets[1].push(value)
          }
        })
      })
    })

    $scope.submitBet = function(){
        $scope.user.bet.match_id = $scope.currentMatch.id
        $scope.user.bet.user_id = $scope.user.id
        socket.emit('sendBet', {
            bet: $scope.user.bet,
            streamer: $scope.streamer,
            event: $scope.event
        })
        $scope.user.bet = {}
    }

    $scope.cancelBet = function(){
        $scope.user.bet = {}
    }

    socket.on('currentEvent', function(data){
        $scope.$apply(function(){
            $scope.event = data.event
            socket.emit('getCurrentMatch', {
                event: $scope.event,
                streamer: $scope.streamer
            })
            if($scope.event.id == 0){
              socket.emit('getWallet', {
                user: $scope.user
              })
            }else{
              socket.emit('getEventEntry', {
                event: $scope.event,
                user: $scope.user
              })
            }
        })
    })

    socket.on('currentMatch', function(data){
        $scope.$apply(function(){
            $scope.currentMatch = data.match
            socket.emit('getCurrentBets', {
                match: $scope.currentMatch
            })
        })
    })

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
    
    socket.on('streamInfo', function(data){
      $scope.$apply(function(){
        $scope.streamer = data.streamer
        socket.emit('getCurrentEvent', {
            streamer: $scope.streamer
        })
        $scope.setupStream()
      })
    })
    $(window).resize(function(){
        $scope.$apply(function(){
            $scope.stream.width = document.getElementById('stream-view').offsetWidth - 30
            $scope.stream.height = $scope.stream.width / 1.777;
        })
    })
}])