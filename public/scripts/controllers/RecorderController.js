
require(['app'], function(){
	angular.module('jamlab')
		.controller('RecorderController', function ($scope) {
			'use strict';
			$scope.recording = false;
			$scope.toggleRecording = function(){
				$scope.recording = !$scope.recording;
				$('#recordButton').attr('value', ($scope.recording ? 'Stop' : 'Start') + ' Recording');
			};
		});
	});