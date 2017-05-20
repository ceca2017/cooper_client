angular.module('starter.controllers', [])

.controller('AppCtrl', function($rootScope,
                                $scope,
                                $ionicModal,
                                $timeout,
                                $auth,
                                $ionicLoading) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $rootScope.$on('auth:login-success', function(ev, user) {
    $scope.currentUser = user;
  });

  // Form data for the login modal
  $scope.loginData = {};

  // Form data for the signup modal
  $scope.signupData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    // console.log('Doing login', $scope.loginData);
    //
    // // Simulate a login delay. Remove this and replace with your login
    // // code if using a login system
    // $timeout(function() {
    //   $scope.closeLogin();
    // }, 1000);
    $ionicLoading.show({
      template: 'Logging in...'
    });
    $auth.submitLogin($scope.loginData)
      .then(function(resp) {
        // handle success response
        $ionicLoading.hide();
        $scope.closeLogin();
      })
      .catch(function(error) {
        // handle error response
        $ionicLoading.hide();
        $scope.errorMessage = error;
      });
  };




  // Create the sigup modal that we will use later
  $ionicModal.fromTemplateUrl('templates/signup.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalSignup = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeSignup = function() {
    $scope.modalSignup.hide();
  };

  // Open the signup modal
  $scope.signup = function() {
    $scope.modalSignup.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doSignup = function() {
    $ionicLoading.show({
      template: 'signin in...'
    });
    $auth.submitRegistration($scope.signupData)
      .then(function(resp) {
        // handle success response
        $ionicLoading.hide();
        $scope.closeSignup();
      })
      .catch(function(error) {
        // handle error response
        $ionicLoading.hide();
        $scope.errorMessage = error;
      });
  };
})


// use an alert
// heroku logs -t


// .controller('IndexCtrl', function($rootScope,
//                                 $scope,
//                                 $ionicModal,
//                                 $timeout,
//                                 $auth,
//                                 $ionicLoading) {
//
//
//   // Form data for the login modal
//   //$scope.signupData = {};
//
//   // Create the sigup modal that we will use later
//   $ionicModal.fromTemplateUrl('templates/signup.html', {
//     scope: $scope
//   }).then(function(modal) {
//     $scope.modalSignup = modal;
//   });
//
//   // Triggered in the login modal to close it
//   $scope.closeSignup = function() {
//     $scope.modalSignup.hide();
//   };
//
//   // Open the login modal
//   $scope.signup = function() {
//     $scope.modalSignup.show();
//   };
//
//   // Perform the login action when the user submits the login form
//   $scope.doSingup = function() {
//     $ionicLoading.show({
//       template: 'signin in...'
//     });
//     $auth.submitSignup($scope.signupData)
//       .then(function(resp) {
//         // handle success response
//         $ionicLoading.hide();
//         $scope.closeSignup();
//       })
//       .catch(function(error) {
//         // handle error response
//         $ionicLoading.hide();
//         $scope.errorMessage = error;
//       });
//   };
// })

.controller('TestController', function($scope) {
  $scope.gender = ['Male', 'Female']
  $scope.ageValues = {
    min: 20,
    max: 60,
    value:20
  };
  $scope.distanceValues = {
    min: 1000,
    max: 3500,
    value: 1000
  };
  $scope.data = {};
  $scope.calculateCooper = function() {
    var person  = new Person({
      gender: $scope.data.gender,
      age: $scope.data.age
    });
    person.assessCooper($scope.data.distance);
    $scope.person = person;
    console.log($scope.person);
  };
});
