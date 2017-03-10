angular.module('rooster.app.controllers', [])

	.controller('AppCtrl', function($scope, $ionicModal, $state) {
		$scope.logo = "img/logo.png";
		
		$scope.doLogOut = function () {
			firebase.auth().signOut().then(function() {
				$state.go('login');
			}, function(error) {
				alert(error);
			});
		}
	})

    .controller('AuthCtrl', function ($scope, $state, $ionicModal, $firebaseArray) {
	    $scope.title = "Login";
        $scope.logo = "img/logo.png";
	    $scope.data = {};
	    firebase.auth().onAuthStateChanged(function(user) {
		    if (user) {
			    $state.go('app.rooster');
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
        }

    })

    .controller('RoosterCtrl', function($scope, $ionicSideMenuDelegate){

	    $scope.title = "Rooster";
	    $scope.todayLessons = [];

	    var times = [];
	    var starttime = 8;
	    var hours = starttime;
	    var minutes = 0;
	    var startcount = 0;
	    for (var i = 0; i < 29; i++) {

	    		if(starttime == hours){
	    			if(startcount == 0) {
	    				minutes = '00';
				    } else if(startcount == 1) {
	    				minutes = 20;
				    } else {
	    				hours += 1;
	    				minutes = '00';
				    }
				    startcount++;
			    } else if(i % 2 == 0) {
				    minutes = '00';
				    hours += 1;
			    } else {
				    minutes = 20;
			    }
			    times.push(hours + ':' + minutes);


	    }
	    $scope.times = times;


	    var fb = firebase.database();

	    var lessons = fb.ref('lessons');

	    lessons.on('value', function (data) {

	    	var lessonsCollection = data.val();
	    	var startdate, enddate, curdate = new Date(); 
		    for (var i = 0; i < lessonsCollection.length; i++) {

			    startdate = new Date( lessonsCollection[i].begin_date );
			    enddate = new Date( lessonsCollection[i].end_date );

			    if(curdate.getFullYear() === startdate.getFullYear()) {
			    	if(curdate.getMonth() === startdate.getMonth()) {
			    		if(curdate.getDate() === startdate.getDate()) {
						    $scope.todayLessons.push(lessonsCollection[i]);
					    }
				    }
			    }

		    }

	    });

    })

    .controller('LessonCtrl', function($scope){
	    $scope.title = "Les toevoegen";
        var fb = firebase.database();
        $scope.formData = {};

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

	.controller('AbsenceCtrl', function($scope){

	})
;


