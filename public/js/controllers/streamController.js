var app = angular.module('CasinoNight.stream', [])
app.controller('StreamController', ['$scope', '$state', '$sce', function($scope, $stateParams, $sce){
	$scope.streamer = $stateParams.params.streamer;
	console.log($scope.streamer)
	var server = "http://localhost:3000/stream?streamer=dada5714";
    var socket = io(server, {query: "streamer=dada5714"});
    console.log(socket)

    socket.emit('getRecentMatch', {
        streamer: $scope.streamer,
        user: 2
    })
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
}])