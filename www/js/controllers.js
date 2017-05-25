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
    $scope.currentUser = angular.extend(user, $auth.retrieveData('auth_headers'));
  });

  $rootScope.$on('auth:logout-success', function() {
    delete $scope.currentUser;
  });

  // Form data for the login modal
  $scope.loginData = {};

  // Form data for the signup modal
  $scope.signupData = {};

  // Form data for the change passord modal
  $scope.changePasswordForm = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
    $scope.errorMessage = {};
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
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


  // Create the sign out modal that we will use later
  $ionicModal.fromTemplateUrl('templates/signout.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalSignout = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeSignout = function() {
    $scope.modalSignout.hide();
  };

  // Open the signout modal
  $scope.signout = function() {
    $scope.modalSignout.show();
  };

  // Perform the signout action when the user submits the login form
  $scope.doSignout = function() {
    $ionicLoading.show({
      template: 'Signing out...'
    });
    $auth.signOut()
      .then(function(resp) {
        // handle success response
        $ionicLoading.hide();
        $scope.closeSignout();
      })
      .catch(function(error) {
        // handle error response
        $ionicLoading.hide();
        $scope.errorMessage = error;
      });
  };

  // Change password

  // Create the update password modal that we will use later
  $ionicModal.fromTemplateUrl('templates/updatepwd.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalUpdatePwd = modal;
  });

  // Triggered in the modal to close it
  $scope.closeUpdatePwd = function() {
    $scope.modalUpdatePwd.hide();
    $scope.okMessage = '';
    $scope.errorMessage = {};
  };

  // Open the modal
  $scope.updatePwd = function() {
    $scope.modalUpdatePwd.show();
  };

  //$scope.handleUpdatePasswordBtnClick = function() {
  $scope.doUpdatePassword = function() {
    console.log("handleUpdatePasswordBtnClick")
    $ionicLoading.show({
      template: 'Updating password...'
    });
    $auth.updatePassword($scope.changePasswordForm)
      .then(function(resp) {
        // handle success response
        $ionicLoading.hide();
        console.log("Success")
        $scope.okMessage ='Success';
        //$scope.closeUpdatePwd();
      })
      .catch(function(error) {
        // handle error response
        console.log(error);
        $ionicLoading.hide();
        $scope.errorMessage = error;
      });
  };


  // Sign-up

  // Create the sigup modal that we will use later
  $ionicModal.fromTemplateUrl('templates/signup.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalSignup = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeSignup = function() {
    $scope.modalSignup.hide();
    $scope.okMessage = '';
    $scope.errorMessage = {};
  };

  // Open the signup modal
  $scope.signup = function() {
    $scope.modalSignup.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doSignup = function() {
    $ionicLoading.show({
      template: 'Creating user...'
    });
    $auth.submitRegistration($scope.signupData)
      .then(function(resp) {
        // handle success response
        $ionicLoading.hide();
        $scope.okMessage ='Success';
      })
      .catch(function(error) {
        // handle error response
        $ionicLoading.hide();
        $scope.errorMessage = error;
      });
  };
})




.controller('PerformanceCtrl', function($scope, $state, performanceData, $ionicLoading, $ionicPopup, $state) {

  $scope.saveData = function(person) {
    var data = {performance_data: {data: {message: person.cooperMessage}}};
    $ionicLoading.show({
      template: 'Saving...'
    });
    performanceData.save(data, function(response){
      $ionicLoading.hide();
      $scope.showAlert('Success', response.message);
    }, function(error){
      $ionicLoading.hide();
      $scope.showAlert('Error', error.statusText);
    });
  };

  $scope.retrieveData = function() {
    $ionicLoading.show({
      template: 'Retrieving data...'
    });
    performanceData.query({}, function(response){
      $state.go('app.data', {savedDataCollection: response.entries});
      $ionicLoading.hide();
    }, function(error){
      $ionicLoading.hide();
      $scope.showAlert('Error', error.statusText);
    });
  };

  $scope.showAlert = function(message, content) {
    var alertPopup = $ionicPopup.alert({
      title: message,
      template: content
    });
    alertPopup.then(function(res) {
      // some action if needed ...
    });
  };
})

.controller('DataCtrl', function($scope, $stateParams){
  $scope.$on('$ionicView.enter', function() {
    $scope.savedDataCollection = $stateParams.savedDataCollection;
    $scope.labels = getLabels($scope.savedDataCollection);
    $scope.data = [];
    angular.forEach($scope.labels, function(label){
      $scope.data.push(getCount($scope.savedDataCollection, label));
    });
    $scope.radardata = [$scope.data];
  });

  function getLabels(collection) {
    var uniqueLabels = [];
    for (i = 0; i < collection.length; i++) {
      if (collection[i].data.message && uniqueLabels.indexOf(collection[i].data.message) === -1 ) {
        uniqueLabels.push(collection[i].data.message);
      }
    }
    return uniqueLabels;
  }

  function getCount(arr, value){
    var count = 0;
    angular.forEach(arr, function(entry){
      count += entry.data.message == value ? 1 : 0;
    });
    return count;
  }
})

.controller('TestController', function($scope) {
  $scope.gender = ['Male', 'Female'];
  $scope.ageValues = {
    min: 20,
    max: 60,
    value: 20
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
  };
});
