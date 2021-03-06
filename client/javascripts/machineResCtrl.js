/**
 * Created by MrComputer on 10/7/15.
 */


 app.controller('machineResCtrl', ['$scope', '$http', '$location', '$mdDialog', 'authService', 'toolService', function($scope, $http, $location, $mdDialog, authService, toolService){
   var user = authService.parseJwt(sessionStorage.getItem('userToken'));
   $scope.accountType = user.accountType;
   //open the calendar dialog
     $scope.openCalendar = function(index, ev) {
        $scope.loading = true;
       $mdDialog.show({
         controller: 'calendarCtrl',
         templateUrl: '/private/calendarDialog.html',
         parent: angular.element(document.body),
         targentEvent: ev,

         clickOutsideToClose: true,
         locals: {
           machine: $scope.machines[index]
         }

       }).then(function() {
           $scope.loading = false;
       });
       //.then is optional here
     };
     //open the add machine dialog
     $scope.addMachineDialog = function(ev) {
       $mdDialog.show({
         templateUrl: '/admin/addMachine.html',
         parent: angular.element(document.body),
         targentEvent: ev,
         clickOutsideToClose: true
       })
     };
     var updateMachines = function(machines){
       $scope.machines = machines;
     }

     toolService.getTools(updateMachines);
   //if an admin makes a change this will update the tool
     $scope.updateMachine = function(index) {
       var data = $scope.machines[index];
       $http({
         method: 'PUT',
         url: '/tools',
         data: data
       }).then(function(res){
         if(res.status == 200){
           toolService.getTools(updateMachines);
         }
       });
     };
   //admin tool to delete machine
     $scope.deleteMachine = function(index) {
       var data = $scope.machines[index];
       $http({
         method: 'DELETE',
         url: '/tools/' + data._id
       }).then(function(res){
         if(res.status == 200){
           toolService.getTools(updateMachines);
         }
       })
     };
     //add machine to machines list
     $scope.addMachine = function() {
       if(!$scope.addmachine) return;
       data = $scope.addmachine;
       data.online = true;
       $http({
         method: 'POST',
         url: '/tools',
         data: data
       }).then(function(res){
         if(res.status == 200){
           toolService.getTools(updateMachines);
           $scope.machine = {};
           $mdDialog.hide();
         }

       });
     };
 }]);
