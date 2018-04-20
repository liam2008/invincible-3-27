(function() {
	var app = angular.module("app.authority.addLog", []);
		app.controller("addLogCtrl", ['$scope', 'netManager',
		function($scope, netManager) {
			
			$scope.summernoteText = '';
			
			$scope.submitText = function() {
				alert($scope.summernoteText)
			};
			 $scope.options = {
				    height: 500,
				    focus: true,
				    airMode: true
				 };
		}
	]);
}())