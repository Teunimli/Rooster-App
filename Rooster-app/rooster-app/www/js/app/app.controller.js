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
		    	if($state.current.name == 'login') {
				    $state.go('app.rooster');
			    }
		    }
	    });


        $scope.doLogIn = function () {


        	var auth = firebase.auth();
	        var email = $scope.data.username;
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

    .controller('RoosterCtrl', function($scope, $ionicSideMenuDelegate, $state, $ionicTabsDelegate){

	    $scope.title = "Rooster";
	    $scope.lessonsMonday = [];
	    $scope.lessonsTuesday = [];
	    $scope.lessonsWednesday = [];
	    $scope.lessonsThursday = [];
	    $scope.lessonsFriday = [];
	    var curdate = new Date();
	    console.log(curdate.getDay() -1);

	    $scope.selectTab = function () {
		    $ionicTabsDelegate.select(curdate.getDay() -1);
	    };



	    var times = [];
	    var hours = 8;
	    var minutes = '00';
	    var user = firebase.auth().currentUser;

	    $scope.goToDay = function (day) {
		    $state.go('app.rooster', {dayOfWeek: day})
	    };

	    function getWeekNumber(d) {
		    // Copy date so don't modify original
		    d = new Date(+d);
		    d.setHours(0,0,0,0);
		    // Set to nearest Thursday: current date + 4 - current day number
		    // Make Sunday's day number 7
		    d.setDate(d.getDate() + 4 - (d.getDay()||7));
		    // Get first day of year
		    var yearStart = new Date(d.getFullYear(),0,1);
		    // Calculate full weeks to nearest Thursday
		    return Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
	    }

	    do {
		    times.push(hours + ':' + minutes);
		    $scope.lessonsMonday.push({
		    	"ID"            : 0,
		    	"hour"          : hours,
			    "minutes"       : minutes,
			    "hasLesson"     : false,
			    "title"         : '',
			    "description"   : ''
		    });
		    $scope.lessonsTuesday.push({
			    "ID"            : 0,
			    "hour"          : hours,
			    "minutes"       : minutes,
			    "hasLesson"     : false,
			    "title"         : '',
			    "description"   : ''
		    });
		    $scope.lessonsWednesday.push({
			    "ID"            : 0,
			    "hour"          : hours,
			    "minutes"       : minutes,
			    "hasLesson"     : false,
			    "title"         : '',
			    "description"   : ''
		    });
		    $scope.lessonsThursday.push({
			    "ID"            : 0,
			    "hour"          : hours,
			    "minutes"       : minutes,
			    "hasLesson"     : false,
			    "title"         : '',
			    "description"   : ''
		    });
		    $scope.lessonsFriday.push({
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
	    var users = fb.ref('users');
	    users.orderByChild("email").equalTo(user.email).on("child_added", function(usersid) {
		    var userid = usersid.key;
		    var tuser = fb.ref("users/" + userid);
		    tuser.on('value', function (userdata) {
			    var currentclass = userdata.val().class;


			    var lessons = fb.ref('lessons');
			    lessons.orderByChild("class").equalTo(currentclass).on("child_added", function(lessonsid) {
				    var lessonid = lessonsid.key;
				    var curlesson = fb.ref("lessons/" + lessonid);

				    curlesson.on('value', function (lessondata) {
					    var lesson = lessondata.val();


					    var startdate = new Date( lesson.begin_date );
					    var enddate = new Date( lesson.end_date );
					    if(curdate.getFullYear() === startdate.getFullYear()) {
						    if (curdate.getMonth() === startdate.getMonth()) {
							    if (getWeekNumber(curdate) === getWeekNumber(startdate)) {
							    	switch (startdate.getDay()) {
									    case 1:
										    for (var j = 0; j < $scope.lessonsMonday.length; j++) {
											    if (startdate.getMinutes() == 0) {
												    var minutes = '00';
											    } else {
												    var minutes = startdate.getMinutes();
											    }
											    if (!$scope.lessonsMonday[j].hasLesson) {
												    if ($scope.lessonsMonday[j].hour == startdate.getHours() && $scope.lessonsMonday[j].minutes == minutes) {
													    $scope.lessonsMonday[j].ID = lessonid;
													    $scope.lessonsMonday[j].hasLesson = true;
													    $scope.lessonsMonday[j].title = lesson.title;
													    $scope.lessonsMonday[j].description = lesson.description;

													    if (enddate.getHours() - startdate.getHours() > 0) {
														    var looptime = 0;
														    if (enddate.getMinutes() - startdate.getMinutes() > 0) {
															    looptime += (enddate.getMinutes() - startdate.getMinutes()) / 20;
														    }
														    looptime += (enddate.getHours() - startdate.getHours()) * 3;

														    for (var k = 1; k <= looptime; k++) {
															    var number = j + k;
															    $scope.lessonsMonday[number].hasLesson = true;
															    $scope.lessonsMonday[number].ID = lessonid;

														    }
													    } else if (enddate.getMinutes() - startdate.getMinutes() > 0) {
														    var looptime = (enddate.getMinutes() - startdate.getMinutes()) / 20;
														    for (var k = 1; k <= looptime; k++) {
															    var number = j + k;
															    $scope.lessonsMonday[number].hasLesson = true;
															    $scope.lessonsMonday[number].ID = lessonid;

														    }
													    }

												    }
											    }

										    }
									    	break;
									    case 2:
										    for (var j = 0; j < $scope.lessonsTuesday.length; j++) {
											    if (startdate.getMinutes() == 0) {
												    var minutes = '00';
											    } else {
												    var minutes = startdate.getMinutes();
											    }
											    if (!$scope.lessonsTuesday[j].hasLesson) {
												    if ($scope.lessonsTuesday[j].hour == startdate.getHours() && $scope.lessonsTuesday[j].minutes == minutes) {
													    $scope.lessonsTuesday[j].ID = lessonid;
													    $scope.lessonsTuesday[j].hasLesson = true;
													    $scope.lessonsTuesday[j].title = lesson.title;
													    $scope.lessonsTuesday[j].description = lesson.description;

													    if (enddate.getHours() - startdate.getHours() > 0) {
														    var looptime = 0;
														    if (enddate.getMinutes() - startdate.getMinutes() > 0) {
															    looptime += (enddate.getMinutes() - startdate.getMinutes()) / 20;
														    }
														    looptime += (enddate.getHours() - startdate.getHours()) * 3;

														    for (var k = 1; k <= looptime; k++) {
															    var number = j + k;
															    $scope.lessonsTuesday[number].hasLesson = true;
															    $scope.lessonsTuesday[number].ID = lessonid;

														    }
													    } else if (enddate.getMinutes() - startdate.getMinutes() > 0) {
														    var looptime = (enddate.getMinutes() - startdate.getMinutes()) / 20;
														    for (var k = 1; k <= looptime; k++) {
															    var number = j + k;
															    $scope.lessonsTuesday[number].hasLesson = true;
															    $scope.lessonsTuesday[number].ID = lessonid;

														    }
													    }

												    }
											    }

										    }
									    	break;
									    case 3:
										    for (var j = 0; j < $scope.lessonsWednesday.length; j++) {
											    if (startdate.getMinutes() == 0) {
												    var minutes = '00';
											    } else {
												    var minutes = startdate.getMinutes();
											    }
											    if (!$scope.lessonsWednesday[j].hasLesson) {
												    if ($scope.lessonsWednesday[j].hour == startdate.getHours() && $scope.lessonsWednesday[j].minutes == minutes) {
													    $scope.lessonsWednesday[j].ID = lessonid;
													    $scope.lessonsWednesday[j].hasLesson = true;
													    $scope.lessonsWednesday[j].title = lesson.title;
													    $scope.lessonsWednesday[j].description = lesson.description;

													    if (enddate.getHours() - startdate.getHours() > 0) {
														    var looptime = 0;
														    if (enddate.getMinutes() - startdate.getMinutes() > 0) {
															    looptime += (enddate.getMinutes() - startdate.getMinutes()) / 20;
														    }
														    looptime += (enddate.getHours() - startdate.getHours()) * 3;

														    for (var k = 1; k <= looptime; k++) {
															    var number = j + k;
															    $scope.lessonsWednesday[number].hasLesson = true;
															    $scope.lessonsWednesday[number].ID = lessonid;

														    }
													    } else if (enddate.getMinutes() - startdate.getMinutes() > 0) {
														    var looptime = (enddate.getMinutes() - startdate.getMinutes()) / 20;
														    for (var k = 1; k <= looptime; k++) {
															    var number = j + k;
															    $scope.lessonsWednesday[number].hasLesson = true;
															    $scope.lessonsWednesday[number].ID = lessonid;

														    }
													    }

												    }
											    }

										    }
									    	break;
									    case 4:
										    for (var j = 0; j < $scope.lessonsThursday.length; j++) {
											    if (startdate.getMinutes() == 0) {
												    var minutes = '00';
											    } else {
												    var minutes = startdate.getMinutes();
											    }
											    if (!$scope.lessonsThursday[j].hasLesson) {
												    if ($scope.lessonsThursday[j].hour == startdate.getHours() && $scope.lessonsThursday[j].minutes == minutes) {
													    $scope.lessonsThursday[j].ID = lessonid;
													    $scope.lessonsThursday[j].hasLesson = true;
													    $scope.lessonsThursday[j].title = lesson.title;
													    $scope.lessonsThursday[j].description = lesson.description;

													    if (enddate.getHours() - startdate.getHours() > 0) {
														    var looptime = 0;
														    if (enddate.getMinutes() - startdate.getMinutes() > 0) {
															    looptime += (enddate.getMinutes() - startdate.getMinutes()) / 20;
														    }
														    looptime += (enddate.getHours() - startdate.getHours()) * 3;

														    for (var k = 1; k <= looptime; k++) {
															    var number = j + k;
															    $scope.lessonsThursday[number].hasLesson = true;
															    $scope.lessonsThursday[number].ID = lessonid;

														    }
													    } else if (enddate.getMinutes() - startdate.getMinutes() > 0) {
														    var looptime = (enddate.getMinutes() - startdate.getMinutes()) / 20;
														    for (var k = 1; k <= looptime; k++) {
															    var number = j + k;
															    $scope.lessonsThursday[number].hasLesson = true;
															    $scope.lessonsThursday[number].ID = lessonid;

														    }
													    }

												    }
											    }

										    }
									    	break;
									    case 5:
										    for (var j = 0; j < $scope.lessonsFriday.length; j++) {
											    if (startdate.getMinutes() == 0) {
												    var minutes = '00';
											    } else {
												    var minutes = startdate.getMinutes();
											    }
											    if (!$scope.lessonsFriday[j].hasLesson) {
												    if ($scope.lessonsFriday[j].hour == startdate.getHours() && $scope.lessonsFriday[j].minutes == minutes) {
													    $scope.lessonsFriday[j].ID = lessonid;
													    $scope.lessonsFriday[j].hasLesson = true;
													    $scope.lessonsFriday[j].title = lesson.title;
													    $scope.lessonsFriday[j].description = lesson.description;

													    if (enddate.getHours() - startdate.getHours() > 0) {
														    var looptime = 0;
														    if (enddate.getMinutes() - startdate.getMinutes() > 0) {
															    looptime += (enddate.getMinutes() - startdate.getMinutes()) / 20;
														    }
														    looptime += (enddate.getHours() - startdate.getHours()) * 3;

														    for (var k = 1; k <= looptime; k++) {
															    var number = j + k;
															    $scope.lessonsFriday[number].hasLesson = true;
															    $scope.lessonsFriday[number].ID = lessonid;

														    }
													    } else if (enddate.getMinutes() - startdate.getMinutes() > 0) {
														    var looptime = (enddate.getMinutes() - startdate.getMinutes()) / 20;
														    for (var k = 1; k <= looptime; k++) {
															    var number = j + k;
															    $scope.lessonsFriday[number].hasLesson = true;
															    $scope.lessonsFriday[number].ID = lessonid;

														    }
													    }

												    }
											    }

										    }
									    	break;
								    }
							    }
						    }
					    }
				    })
			    });
		    });
	    });



	    $scope.goToSingleLesson = function (lessonID) {

		    $state.go('app.singleLesson', {"lessonID": lessonID});

	    }

    })

	.controller('SingleLessonCtrl', function ($scope, $stateParams, $firebaseArray, $state) {
		var lessonID = $stateParams.lessonID;
		var lesson = firebase.database().ref("lessons/" + lessonID);
		lesson.on('value', function (data) {
			$scope.lesson = data.val();
		});

		$scope.goToPresence = function () {
			$state.go('app.presence', {"lessonID": lessonID})
		}
	})

	.controller('PresenceCtrl', function ($scope, $stateParams, $firebaseArray) {


	})

	.controller('StudentsCtrl', function ($scope, $stateParams, $firebaseArray, $state) {
		$scope.formData = {};
		var user = firebase.auth().currentUser;
		if (user) {
			var curemail = user.email;
		} else {
			$state.go('login');
		}

		var fb = firebase.database();
		var users = fb.ref('users');

		users.on('value', function (data) {
			$scope.allUsers = data.val();
		});

		function writeStudentData(userId, email, name, role) {
			fb.ref('users/' + userId).set({
				email: email,
				name: name,
				role : role
			});
		}


		$scope.doStudentAdd = function () {

			var users = fb.ref('users');
			var hasAdded = false;

			firebase.auth().onAuthStateChanged(function(user) {
				if (user) {
					if(user.email != curemail) {
						firebase.auth().signOut().then(function () {
							firebase.auth().signInWithEmailAndPassword(curemail, $scope.formData.currentUserPassword).catch(function (error) {
								// Handle Errors here.
								var errorCode = error.code;
								var errorMessage = error.message;

								alert(errorMessage);
							});
						}).catch(function (error) {
							alert(error);
						});
					} else if(!hasAdded) {
						hasAdded = true;
						users.once('value', function (data) {
							var allUsers = data.val();

							if (allUsers == null) {
								writeStudentData(0, $scope.formData.email, $scope.formData.name , 'leerling');
							} else {
								writeStudentData(allUsers.length, $scope.formData.email, $scope.formData.name , 'leerling');
							}

						});
						$state.go('app.students');
					}

				} else {
					// No user is signed in.
				}
			});

			firebase.auth().createUserWithEmailAndPassword($scope.formData.email, $scope.formData.password).catch(function(error) {
				// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;
				alert(errorMessage);
				// ...
			});


		}
	})

	.controller('ClassesCtrl', function ($scope, $stateParams, $firebaseArray, $state) {
		var fb = firebase.database();
		$scope.formData = {};

		var classes = fb.ref('classes');

		classes.on('value', function (data) {
			$scope.classes = data.val();
		});

		var users = fb.ref('users');

		function writeClassData(userId, name) {
			fb.ref('classes/' + userId).set({
				name: name
			});
		}

		users.on('value', function (data) {
			$scope.users = data.val();
		});

		$scope.doClassAdd = function () {
			var students = $scope.formData.students;
			var classes = fb.ref('classes');
			var users = fb.ref('users');
			for (var i = 0; i < students.length; i++) {
				users.orderByChild("email").equalTo(students[i]).on("child_added", function (snapshot) {
					var userid = snapshot.key;
					fb.ref().child('/users/' + userid).update({ class:  $scope.formData.name});
				})

			}

			classes.once('value', function (data) {

				var allClasses = data.val();

				if (allClasses == null) {
					writeClassData(0, $scope.formData.name);
				} else {
					writeClassData(allClasses.length, $scope.formData.name);
				}
			})
		}
	})

    .controller('LessonCtrl', function($scope, $state){
	    $scope.title = "Les toevoegen";
        var fb = firebase.database();
        $scope.formData = {};

        var classes = fb.ref('classes');

        classes.on('value', function (data) {
	       $scope.classes = data.val();
        });

        function writeLessonData(userId, title, description, begin_date, end_date, the_class) {
            fb.ref('lessons/' + userId).set({
                title: title,
                description: description,
                begin_date : begin_date,
                end_date : end_date,
	            class: the_class
            });
            $state.go('app.rooster');
        }

        $scope.doLessonAdd = function () {
			var begin_date = $scope.formData.begin_datetime.getTime();
			var end_date = $scope.formData.end_datetime.getTime();

			var lessons = fb.ref('lessons');

			lessons.once('value', function (data) {

				var allLessons = data.val();

				if (allLessons == null) {
					writeLessonData(0, $scope.formData.title, $scope.formData.description, begin_date, end_date, $scope.formData.class);
				} else {
					writeLessonData(allLessons.length, $scope.formData.title, $scope.formData.description, begin_date, end_date, $scope.formData.class);
				}
			});
		}
    })

	.controller('AbsenceCtrl', function($scope, $state){
		var user = firebase.auth().currentUser;
		var fb = firebase.database();
		var absence = fb.ref('absence');
		$scope.allAbsence = [];
		$scope.formData = {};

		absence.orderByChild('approved').equalTo(0).on("child_added", function(approvedData){

			var absences = fb.ref("absence/" + approvedData.key);
			absences.on('value', function (data) {
				var alldata = data.val();
				alldata.id = approvedData.key;
				$scope.allAbsence.push(alldata);
			})
		});

		function writeAbsenceData(userId, reson, description, begin_date, end_date, approved, email,displayname,viewed) {
			fb.ref('absence/' + userId).set({
				reson: reson,
				description: description,
				begin_date : begin_date,
				end_date : end_date,
				approved : approved,
				email : email,
				displayname: displayname,
				viewed: viewed
			});
		}

		$scope.doAbsenceAdd = function (){
			var begin_date = $scope.formData.begin_datetime.getTime();
			var end_date = $scope.formData.end_datetime.getTime();


			absence.once('value', function(data){

				var allAbsence = data.val();

				if(allAbsence == null){
					writeAbsenceData(0, $scope.formData.reson, $scope.formData.description, begin_date, end_date, 0, user.email, user.displayName,0);
					$state.go('app.absence');
				}else{
					writeAbsenceData(allAbsence.length, $scope.formData.reson, $scope.formData.description, begin_date, end_date, 0, user.email, user.displayName,0);
					$state.go('app.absence');
				}

			});

		}


	})

	.controller('AbsenceDetailCtrl', function($scope, $stateParams, $state){
		var id = $stateParams.absenceId;
		var absence = firebase.database().ref("absence/" + id);
		absence.once('value', function (data) {
			$scope.absence = data.val();
		})

		function updatePost(approved,viewed) {

			firebase.database().ref().child('/absence/' + id).update({ approved:  approved, viewed: viewed});

		}

		$scope.approved = function(){
			updatePost(1, 1);
			$state.go('app.absence');
		}

		$scope.cancel = function(){
			updatePost(0, 1);
			$state.go('app.absence');
		}

	})

;


