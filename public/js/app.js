var app = angular.module('CasinoNight', [
  'ui.router', 
  'CasinoNight.services',
  'CasinoNight.controllers', 
  'CasinoNight.directives',
  'angular-md5'
])
app.run(['$state', '$rootScope', '$location', 'Auth', function($state, $rootScope, $location, Auth){
  $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams){
    if(fromState.name == "stream"){
      
    }
  })
}])
app.config(['$urlRouterProvider', '$stateProvider', '$httpProvider', function($urlRouterProvider, $stateProvider, $httpProvider){
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
    .state('events', {
      url: "/events",
      templateUrl: 'partials/events/index.html',
      controller: 'EventsController'
    })
    .state('new_event', {
      url: "/events/new",
      templateUrl: 'partials/events/new.html',
      controller: 'NewEventController'
    })
    .state('event', {
      url: "/events/:event_id",
      templateUrl: 'partials/events/view.html',
      controller: 'EventViewController'
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
    .state('settings', {
      url: "/settings",
      templateUrl: "partials/settings.html",
      controller: "SettingsController"
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
