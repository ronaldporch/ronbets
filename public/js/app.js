var app = angular.module('CasinoNight', ['ui.router', 'CasinoNight.stream', 'CasinoNight.portal'])
app.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider){
  $urlRouterProvider.otherwise('/')
  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: 'partials/home.html',
      controller: 'HomeController'
    })
    .state('users', {
      url: "/users",
      templateUrl: 'partials/users.html',
      controller: 'UsersController'
    })
    .state('user', {
      url: "/users/{user}",
      templateUrl: "partials/user.html",
      controller: "UserController"
    })
    .state('games', {
      url: "/games",
      templateUrl: "partials/games.html",
      controller: "GamesController"
    })
    .state('game', {
      url: "/games/{game}",
      templateUrl: "partials/game.html",
      controller: "GameController"
    })
    .state('stream', {
      url: "/stream/{streamer}",
      templateUrl: "partials/stream.html",
      controller: "StreamController"
    })
    .state('portal', {
      url: "/portal",
      templateUrl: "partials/portal.html",
      controller: "PortalController"
    })
}])
app.controller('HomeController', ['$scope', function($scope){

}])
app.controller('UsersController', ['$scope', function($scope){
  
}])
app.controller('UserController', ['$scope', '$stateParams', function($scope, $stateParams){
  $scope.user = $stateParams.user
  console.log($scope.user)
}])
app.controller('GamesController', ['$scope', '$stateParams', function($scope, $stateParams){
  
}])
app.controller('GameController', ['$scope', '$stateParams', function($scope, $stateParams){
  $scope.game = $stateParams.game.replace(/-/g, " ")
  console.log($scope.game)
}])
app.controller('AdminController', ['$scope', function($scope){
  var server = "http://localhost:3000/user"
  var socket = io.connect(server);
  socket.emit('askUserInfo', {user:1})
  socket.on('sendUserInfo', function(data){
    $scope.$apply(function(){
      $scope.user = data.user[0];
    });
    console.log($scope.user)
  })
}])
  app.controller('TestController', ['$scope', '$interval', '$rootScope',function($scope, $interval, $rootScope){
    $scope.currentBet = {}

    $scope.startNewBetTimer = function(data){
      $scope.stopBetTimer();
      $scope.$apply(function(){
        $scope.currentBet = data;
        $scope.betters.player1 = [];
        $scope.betters.player2 = [];
      console.log($scope.currentBet.players)
      })
    }

    var server = "http://localhost:3000/";
    var socket = io.connect(server);

    socket.on('bettingClosed', function(data){
      $scope.$apply(function(){
        console.log("Closing Bets")
        $scope.currentBet.active = false;
      })
    })
    socket.on('currentBet', function(data){
      $scope.$apply(function(){
        $scope.currentBet = data
        console.log($scope.currentBet)
      })
      console.log("Hello")
      console.log(data)
    })
    socket.on('currentBets', function(data){
      $scope.$apply(function(){
        $scope.betters.player1 = [];
        $scope.betters.player2 =[];
        data.bets.forEach(function(value, index, ar){
          if(value.player_id == 1){
            var newBet = {
              name: value.username,
              bet: value.amount
            }
            $scope.betters.player1.push(newBet)
          }else{
            var newBet = {
              name: value.username,
              bet: value.amount
            }
            $scope.betters.player2.push(newBet)
          }
        })
      })
    })
    socket.on('matchClosed', function(data){
      $scope.$apply(function(){
        $scope.currentBet = data;
        socket.emit('askUserInfo', {user:2})
      })
    })
    socket.on('remaining_time', function(data){
      $scope.$apply(function(){
        $scope.currentBet.remaining_time = data.remaining_time;
      })
      console.log($scope.currentBet.remaining_time);
    })
    socket.on('startNewMatch', function(data){
      $scope.startNewBetTimer(data);
    })
    socket.on('updatedMoney', function(data){
      $scope.$apply(function(){
        $scope.user.money = data.money
        console.log("Money: ", $scope.user.money)
      })
    })
    socket.on('sendUserInfo', function(data){
      console.log(data)
      $scope.$apply(function(){
        var user = data.user.map(function(data){
        return {
          username: data.username,
          money: parseInt(data.money)
        }
      });
        $scope.user = user[0]
      })
      console.log($scope.user)
    })
    socket.emit('askUserInfo', {user:2})
  socket.on('news', function (data) {
    console.log(data.bets)
    var player = data.bets[0]['player_id'];
    var bets = data.bets.map(function(data){
      return {
        name: data.username,
        bet: data.amount
      }
    });
    console.log(bets)
    $scope.$apply(function(){
      switch(player){
      case "1":
        $scope.betters.player1 = bets;
        break;
      case "2":
        $scope.betters.player2 = bets;
        break;
    }
    })
  });

    $scope.stopBetTimer = function(){
      if(angular.isDefined(stop)){
        $scope.currentBet.active = false;
        $scope.showBet1 = false;
        $scope.showBet2 = false;
        $scope.totalBets = {
          player1: 0,
          player2: 0
        }
        $scope.betters.player1.forEach(function(value, index, ar){
          $scope.totalBets.player1 += parseInt(value.bet)
        })
        $scope.betters.player2.forEach(function(value, index, ar){
          $scope.totalBets.player2 += parseInt(value.bet)
        })
        console.log($scope.totalBets)
        $scope.odds = {};
        if($scope.totalBets.player1 > $scope.totalBets.player2){
          $scope.odds.player1 = Math.round(($scope.totalBets.player1 / $scope.totalBets.player2) * 100)/100
          $scope.odds.player2 = 1
        }else{
          $scope.odds.player2 = Math.round(($scope.totalBets.player1 / $scope.totalBets.player2) * 100)/100
          $scope.odds.player1 = 1
        }
        console.log($scope.odds)
      }
    }

    socket.on('updatedTotals', function(data){
      $scope.$apply(function(){
        $scope.currentBet.totals = data.totals
        $scope.currentBet.odds = data.odds
      })
    })

    $scope.closeBet = function(player){
      console.log("Player: ", player)
      if(player == 1){
        var betData = [2, $scope.player1Bet, $scope.currentBet.id, 1];
        console.log(betData)
        socket.emit('my other event', 
        { 
          betData: betData
        });
        $scope.showBet1 = false;
      }else{
        var betData = [2, $scope.player2Bet, $scope.currentBet.id, 2];
        console.log(betData)
        socket.emit('my other event', 
        { 
          betData: betData
        });
        $scope.showBet2 = false;
      }
      $scope.player1Bet = undefined;
      $scope.player2Bet = undefined;
    }
    $scope.betters = {}
  }])