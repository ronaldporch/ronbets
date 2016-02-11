var app = angular.module('CasinoNight.stream', [])
app.controller('StreamController', ['$scope', '$state', '$sce', function($scope, $stateParams, $sce){
	$scope.streamer = $stateParams.params.streamer;
	console.log($scope.streamer)
	var server = "http://localhost:3000/stream";
    var socket = io.connect(server);
    console.log(socket)

    socket.emit('getRecentMatch', {streamer: $scope.streamer})
    socket.on('sendRecentMatch', function(data){
      $scope.$apply(function(){
        $scope.currentMatch = data;
        console.log($scope.currentMatch);
      })
    })

    socket.emit('getStreamInfo', {streamer: $scope.streamer})
    socket.on('sendStreamInfo', function(data){
    	$scope.$apply(function(){
    		$scope.streamer = data;
    		console.log($scope.streamer)
    		$scope.streamUrl = $sce.trustAsResourceUrl("http://player.twitch.tv/?channel=" +  $scope.streamer.stream_name);
    		$scope.chatUrl = $sce.trustAsResourceUrl("http://twitch.tv/" + $scope.streamer.stream_name + "/chat?popout=true");
    	})
    })
}])