angular.module('rooster.app.controllers', [])

    .controller('AuthCtrl', function ($scope,$state, $ionicModal, $firebaseArray) {
        $scope.logo = "img/logo.png";
	    $scope.data = {};
	    firebase.auth().onAuthStateChanged(function(user) {
		    if (user) {
			    $state.go('rooster');
		    } else {
			    console.log('not logged in');
		    }
	    });


        $scope.doLogIn = function () {
	        

        	var auth = firebase.auth();
	        var email = $scope.data.username + '@rocwb.nl';
	        var password = $scope.data.password;

        	auth.signInWithEmailAndPassword(email, password).catch(function (error) {
		        var errorCode = error.code;
		        var errorMessage = error.message;
		        if (errorCode === 'auth/wrong-password') {
			        alert('Wrong password.');
		        } else {
			        alert(errorMessage);
		        }
	        });
	        firebase.auth().onAuthStateChanged(function(user) {
		        if (user) {
			        $state.go('rooster');
		        } else {
			        console.log('not logged in');
		        }
	        });


        }

    })


;


