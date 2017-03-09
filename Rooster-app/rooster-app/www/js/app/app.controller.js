angular.module('rooster.app.controllers', [])

    .controller('AuthCtrl', function ($scope, $state, $ionicModal, $firebaseArray) {
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

    .controller('RoosterCtrl', function($scope){

    })

    .controller('LessonCtrl', function($scope){
        var fb = firebase.database();
        $scope.formData = {};
        var isHasRun = false;

        function writeLessonData(userId, title, description, begin_date, end_date) {
            fb.ref('lessons/' + userId).set({
                title: title,
                description: description,
                begin_date : begin_date,
                end_date : end_date
            });
        }

        $scope.doLessonAdd = function (){
            var begin_date = $scope.formData.begin_datetime.getTime();
            var end_date = $scope.formData.end_datetime.getTime();

            var lessons = fb.ref('lessons');

            lessons.once('value', function(data){

                var allLessons = data.val();

                if(allLessons == null){
                    writeLessonData(0, $scope.formData.title, $scope.formData.description, begin_date, end_date);
                }else{
                    writeLessonData(allLessons.length, $scope.formData.title, $scope.formData.description, begin_date, end_date);
                }


            });




        }



    })
;


