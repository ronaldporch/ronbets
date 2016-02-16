var app = angular.module('CasinoNight.stream', [])
app.controller('StreamController', ['$scope', '$state', '$sce', '$location', 'Auth', function($scope, $stateParams, $sce, $location, Auth){
  $scope.isLoggedIn = Auth.isLoggedIn()
  $scope.streamer = $stateParams.params.streamer;
    $scope.user = {
        bet: {}
    }
  console.log($scope.streamer)
  console.log()
  var server = $location.$$host + "/stream";
    var socket = io(server, {query: "streamer=dada5714"});
    console.log(socket)

    socket.emit('getRecentMatch', {
        streamer: $scope.streamer,
        user: 1,
    })
    socket.on('sendRecentMatch', function(data){
      $scope.$apply(function(){
        $scope.currentMatch = data;
        console.log($scope.currentMatch);
      })
    })
    $scope.startBet = function(player_id){
        $scope.user.bet.player = player_id
    }
    socket.on('startNewMatch', function(data){
        $scope.$apply(function(){
            $scope.currentMatch = data
            $scope.currentBets = [[],[]]
            $scope.user.currentBet = undefined
        })
    })
    socket.on('showWinner', function(data){
        $scope.$apply(function(){
            $scope.currentMatch = data
        })
        socket.emit('getUserInfo', {
            user: 1
        })
    })
    socket.emit('getUserInfo', {
        user: 1
    })
    socket.on('sendUserInfo', function(data){
        $scope.$apply(function(){
            console.log('here')
            $scope.user.wallet = data.wallet
        })
    })
    socket.on('remaining_time', function(data){
        $scope.$apply(function(){
            $scope.currentMatch.remaining_time = data.remaining_time
        })
        console.log('Penis')
    })
    socket.on('bettingClosed', function(data){
        $scope.$apply(function(){
            $scope.currentMatch = data
        })
    })
    socket.on('currentBets', function(data){
        $scope.$apply(function(){
          $scope.currentBets = [[],[]]
        data.forEach(function(value, index, ar){
          console.log(value)
          if(value.player_id == 1){
            $scope.currentBets[0].push(value)
          }else if(value.player_id == 2){
            $scope.currentBets[1].push(value)
          }
        })
            console.log($scope.currentBets)  
        })
    })

    socket.on('yourBet', function(data){
        $scope.$apply(function(){
            $scope.user.currentBet = data
            console.log($scope.user.currentBet)
        })
    })

    socket.on('yourWallet', function(data){
        $scope.$apply(function(){
            $scope.user.wallet = data.wallet
        })
    })

    $scope.submitBet = function(){
        $scope.user.bet.match_id = $scope.currentMatch.id
        $scope.user.bet.user_id = 1
        socket.emit('sendBet', {
            bet: $scope.user.bet,
            streamer: $scope.streamer
        })
        console.log($scope.user.bet)
        $scope.user.bet = {}
    }

    $scope.cancelBet = function(){
        console.log($scope.user.bet)
        $scope.user.bet = {}
    }

    socket.emit('getStreamInfo', {streamer: $scope.streamer})
    socket.on('sendStreamInfo', function(data){
      $scope.$apply(function(){
        $scope.streamer = data;
        console.log($scope.streamer)
            $scope.stream = {
                width: document.getElementById('stream-view').offsetWidth - 30,
                height: (document.getElementById('stream-view').offsetWidth - 30) / 1.777
            }
        $scope.streamUrl = $sce.trustAsResourceUrl("http://player.twitch.tv/?channel=" +  $scope.streamer.stream_name);
        $scope.chatUrl = $sce.trustAsResourceUrl("http://twitch.tv/" + $scope.streamer.stream_name + "/chat?popout=true");
      })
    })
    $(window).resize(function(){
        console.log(document.getElementById('stream-view').offsetWidth)
        $scope.$apply(function(){
            $scope.stream.width = document.getElementById('stream-view').offsetWidth - 30
            $scope.stream.height = $scope.stream.width / 1.777;
        })
    })

    $scope.message = "";
    $scope.sendMessage = function(){
        socket.emit('message', {
            message: $scope.message,
            streamer: $scope.streamer.username
        })
    }
    socket.on('checkMessage', function(data){
        console.log(data.message)
        console.log(data.rooms)
    })
}])