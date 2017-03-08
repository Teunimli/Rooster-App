angular.module('rooster.app.controllers', [])

    .controller('AuthCtrl', function ($scope, $ionicModal, $firebaseArray) {
        $scope.logo = "img/logo.png";

        $scope.nextpage = function(){
            state.go();
        }
        
    })


;


