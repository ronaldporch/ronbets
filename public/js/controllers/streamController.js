var app = angular.module('CasinoNight.stream', [])
app.controller('StreamController', ['$scope', '$state', '$sce', '$location', 'Auth', function($scope, $stateParams, $sce, $location, Auth){
  $scope.isLoggedIn = Auth.isLoggedIn()
  $scope.streamer = $stateParams.params.streamer;
  $scope.user = Auth.currentUserPayload() ? Auth.currentUserPayload() : {}
  $scope.user.bet = {}
  var server = ($location.$$host == "localhost") ? "localhost:3000" + "/stream" : $location.$$host + "/stream"
    var socket = io(server, {'forceNew': true});
    socket.emit('getRecentMatch', {
        streamer: $scope.streamer,
        user: $scope.user.id,
    })
    socket.on('sendRecentMatch', function(data){
      $scope.$apply(function(){
        $scope.currentMatch = data;
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
            user: $scope.user.id
        })
    })
    if(Auth.isLoggedIn()){
        socket.emit('getUserInfo', {
            user: $scope.user.id
        })
        socket.on('sendUserInfo', function(data){
            $scope.$apply(function(){
                $scope.user.wallet = data.wallet
            })
        })
    }

    socket.on('remaining_time', function(data){
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
        data.forEach(function(value, index, ar){
          if(value.player_id == 1){
            $scope.currentBets[0].push(value)
          }else if(value.player_id == 2){
            $scope.currentBets[1].push(value)
          }
        })
        })
    })

    socket.on('yourBet', function(data){
        $scope.$apply(function(){
            $scope.user.currentBet = data
        })
    })

    socket.on('yourWallet', function(data){
        $scope.$apply(function(){
            $scope.user.wallet = data.wallet
        })
    })

    $scope.submitBet = function(){
        $scope.user.bet.match_id = $scope.currentMatch.id
        $scope.user.bet.user_id = $scope.user.id
        socket.emit('sendBet', {
            bet: $scope.user.bet,
            streamer: $scope.streamer
        })
        $scope.user.bet = {}
    }

    $scope.cancelBet = function(){
        $scope.user.bet = {}
    }

    socket.emit('getStreamInfo', {streamer: $scope.streamer})
    socket.on('sendStreamInfo', function(data){
      $scope.$apply(function(){
        $scope.streamer = data;
            $scope.stream = {
                width: document.getElementById('stream-view').offsetWidth - 30,
                height: (document.getElementById('stream-view').offsetWidth - 30) / 1.777
            }
        $scope.streamUrl = $sce.trustAsResourceUrl("http://player.twitch.tv/?channel=" +  $scope.streamer.stream_name);
        $scope.chatUrl = $sce.trustAsResourceUrl("http://twitch.tv/" + $scope.streamer.stream_name + "/chat?popout=true");
      })
    })
    $(window).resize(function(){
        $scope.$apply(function(){
            $scope.stream.width = document.getElementById('stream-view').offsetWidth - 30
            $scope.stream.height = $scope.stream.width / 1.777;
        })
    })
}])