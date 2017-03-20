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

    .controller('RoosterCtrl', function($scope, $ionicSideMenuDelegate, $state){

	    $scope.title = "Rooster";
	    $scope.lessonsGrid = [];
	    $scope.todayLessons = [];

	    var times = [];
	    var hours = 8;
	    var minutes = '00';

	    do {
		    times.push(hours + ':' + minutes);
		    $scope.lessonsGrid.push({
		    	"ID"            : 0,
		    	"hour"          : hours,
			    "minutes"       : minutes,
			    "hasLesson"     : false,
			    "title"         : '',
			    "description"   : ''
		    });
		    if(minutes == '00') {
			    minutes = 0;
		    }

		    if(minutes < 40) {
			    minutes += 20;

		    } else {
			    hours++;
			    minutes = '00';
		    }
	    }
	    while (hours <= 22);

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
						    for (var j = 0; j < $scope.lessonsGrid.length; j++) {
								if(startdate.getMinutes() == 0) {
									var minutes = '00';
								} else {
									var minutes = startdate.getMinutes();
								}
								if(!$scope.lessonsGrid[j].hasLesson) {
									if ($scope.lessonsGrid[j].hour == startdate.getHours() && $scope.lessonsGrid[j].minutes == minutes) {
										var lessonID = i;
										$scope.lessonsGrid[j].ID = lessonID;
										$scope.lessonsGrid[j].hasLesson = true;
										$scope.lessonsGrid[j].title = lessonsCollection[i].title;
										$scope.lessonsGrid[j].description = lessonsCollection[i].description;

										if (enddate.getHours() - startdate.getHours() > 0) {
											var looptime = 0;
											if(enddate.getMinutes() - startdate.getMinutes() > 0) {
												looptime += (enddate.getMinutes() - startdate.getMinutes()) / 20;
											}
											looptime += (enddate.getHours() - startdate.getHours()) * 3;

											for (var k = 1; k <= looptime; k++) {
												var number = j + k;
												$scope.lessonsGrid[number].hasLesson = true;
												$scope.lessonsGrid[number].ID = lessonID;

											}
										} else if (enddate.getMinutes() - startdate.getMinutes() > 0) {
											var looptime = (enddate.getMinutes() - startdate.getMinutes()) / 20;
											for (var k = 1; k <= looptime; k++) {
												var number = j + k;
												$scope.lessonsGrid[number].hasLesson = true;
												$scope.lessonsGrid[number].ID = lessonID;

											}
										}

									}
								}

						    }
					    }
				    }
			    }

		    }

	    });
	    
	    $scope.goToSingleLesson = function (lessonID) {

		    $state.go('app.singleLesson', {"lessonID": lessonID});

	    }

    })

	.controller('SingleLessonCtrl', function ($scope, $stateParams, $firebaseArray) {
		var lessonID = $stateParams.lessonID;
		var lesson = firebase.database().ref("lessons/" + lessonID);
		lesson.on('value', function (data) {
			$scope.lesson = data.val();
		})
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


