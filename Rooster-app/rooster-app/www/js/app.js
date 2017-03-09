// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('rooster', [
    'ionic',
    'firebase',
    'rooster.app.services',
    'rooster.app.controllers',
    'ion-datetime-picker'
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
    
    .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('login', {
            url: "/login",
            templateUrl: "views/auth/login.html",
            controller: 'AuthCtrl'
          })

          .state('rooster', {
              url: "/rooster",
              templateUrl   : "views/app/rooster.html",
              controller: 'RoosterCtrl'
          })

          .state('lesson_add', {
              url: "/lessen_add",
              templateUrl   : "views/app/lesson_add.html",
              controller: 'LessonCtrl'
          })
      ;
      
      
      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/login');
    });
