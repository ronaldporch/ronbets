var app = angular.module('CasinoNight', [
  'ui.router', 
  'CasinoNight.stream', 
  'CasinoNight.portal', 
  'CasinoNight.chatDirective',
  'CasinoNight.streamDirective',
  'CasinoNight.authService',
  'angular-md5'
])
app.run(['$state', '$rootScope', '$location', 'Auth', function($state, $rootScope, $location, Auth){
  $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams){
    if(fromState.name == "stream"){
      console.log($state.params.streamer)
    }
  })
}])
app.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider){
  $urlRouterProvider.otherwise('/')
  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: 'partials/home.html',
      controller: 'HomeController'
    })
    .state('dashboard', {
      url: "/dashboard",
      templateUrl: 'partials/dashboard.html',
      controller: 'DashboardController'
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
    .state('signIn', {
      url: "/sign_in",
      templateUrl: "partials/sign_in.html",
      controller: "SignInController"
    })
    .state('register', {
      url: "/register",
      templateUrl: "partials/register.html",
      controller: "RegisterController"
    })
    .state('activate', {
      url: "/activate/{id}",
      templateUrl: "partials/activate.html",
      controller: "ActivationController"
    })
}])
app.controller('HomeController', ['$scope', function($scope){

}])
app.controller('DashboardController', ['$scope', function($scope){

}])
app.controller('UsersController', ['$scope', function($scope){
  
}])
app.controller('SignInController', ['Auth', '$scope', '$http', '$location', '$state', function(Auth, $scope, $http, $location, $state){
  $scope.server = ($location.$$host == "localhost") ? "localhost:3000" : $location.$$host;
  $scope.signIn = function(){
    $http.post("http://" + $scope.server + '/api/auth/sign_in', $scope.user)
      .then(function(res){
        Auth.saveToken(res.data.token)
        $state.go('dashboard')
      })
  }
}])
app.controller('RegisterController', ['$scope', '$http', '$location', function($scope, $http, $location){
  $scope.user = {}
  $scope.register = function(){
    $scope.server = $location.$$host == "localhost" ? "http://localhost:3000/" : $location.$$host;
    $http.post("http://" + $scope.server + '/api/auth/register', $scope.user)
    .then(function(res){
    })
  }
}])
app.controller('ActivationController', ['$scope', '$stateParams', '$http', '$location', function($scope, $stateParams, $http, $location){
  $scope.server = $location.$$host == "localhost" ? "http://localhost:3000/" : $location.$$host;
  $scope.getUser = function(){
    $scope.user = {}
    $http.get("http://" + $scope.server + '/api/auth/getUser/' + $stateParams.id)
      .then(function(res){
        $scope.user.username = res.data.username
        $scope.user.id = res.data.id
        $scope.user.streamService = "none"
        $scope.user.chatService = "stream"
      })
  }
  $scope.activateUser = function(){
    $http.post("http://" + $scope.server + '/api/auth/activate', $scope.user)
      .then(function(res){
      })
  }
  $scope.getUser()
}])
app.controller('UserController', ['$scope', '$stateParams', function($scope, $stateParams){
  $scope.user = $stateParams.user
}])
app.controller('GamesController', ['$scope', '$stateParams', function($scope, $stateParams){
  
}])
app.controller('GameController', ['$scope', '$stateParams', function($scope, $stateParams){
  $scope.game = $stateParams.game.replace(/-/g, " ")
}])
app.controller('AdminController', ['$scope', 'Auth', '$rootScope', '$state', function($scope, Auth, $rootScope, $state){
  $scope.user = Auth.getToken()
  $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams){
    $scope.user = Auth.getToken()
  })
  $scope.signOut = function(){
    Auth.signOut()
    $state.go('home')
  }
}])