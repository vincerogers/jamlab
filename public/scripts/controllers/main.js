
//require(['app'], function(){
	//angular.module('jamlab')
		//.controller('MainController', function ($scope) {
		var buff;
		function MainController($scope){
			'use strict';
			$scope.inputMode = 'sample';
			$scope.pedals = new Array();
			$scope.board = new SoundBoard();
			$scope.pedalTypes = new Array(
				{id: 'distortion', name: 'distortion'},
				{id:'reverb', name: 'reverb'},
				{id: 'compression', name: 'compression'},
				{id: 'delay', name: 'delay'}
			);
			$scope.selectedPedal = null;
			$scope.bufferLoaded = false;
			$scope.buffer = null;

			JamLab.loadPedalModule("DistortionPedal");
			JamLab.loadPedalModule("ReverbPedal");
			JamLab.loadPedalModule("CompressionPedal");
			JamLab.loadPedalModule("DelayPedal");

			$scope.startAudioStream = function(){
				navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia || navigator.msGetUserMedia;
				navigator.getUserMedia({audio: true}, $scope.board.startUserMedia.bind($scope.board) , function(e) {
					console.log('No live audio input: ' + e);
		 		});
			}
			$scope.stopAudioStream = function(){
				$scope.aStream.disconnectUserMedia();
			}

			$scope.startVideoStream = function(){
				$scope.vStream.connectUserMedia();
			}
			$scope.stopVideoStream = function(ele){
				ele.stop();
				$scope.videoStream = '';
				$scope.vStream.stream.stop();
			}

			$scope.playSample = function(){
				$scope.board.unMute();
			}
			$scope.stopSample = function(){
				$scope.board.mute();
			}

			$scope.addPedal = function(){
				var pedal;
				var seq = $scope.board.nodes.length;
				var id = "pedal" + seq;
				var name = $scope.selectedPedal.name;
				switch(name){
					case "distortion":
						pedal = new DistortionPedal();
						break;
					case "reverb":
						pedal = new ReverbPedal();
						break;
					case "compression":
						pedal = new CompressionPedal();
						break;
					case "delay":
						pedal = new DelayPedal();
						break;
					default:
						throw "Invalid Pedal Selection";
				}

				$scope.pedals.push(
					{
						"id": "pedal" + seq,
						"pedal": pedal,
						"class": name
					}
				);

				$scope.board.addPedalToEnd(pedal);
				$scope.selectedPedal = null;
			}

			$scope.removePedal = function(index){
				console.log("We should remove " + index);
				$scope.board.removePedal(index);
				$scope.pedals.splice(index, 1);
			}

			$scope.loadBuffer = function(){
				var context = new webkitAudioContext();
				(function loadSample(url) {
					var request = new XMLHttpRequest();
					request.open('GET', url, true);
					request.responseType = 'arraybuffer';

					// Decode asynchronously
					request.onload = function() {
						context.decodeAudioData(request.response, function(buffer){
							$scope.buffer = buffer;
							buff = buffer;
							$scope.board.setBuffer(buffer);
							$scope.bufferLoaded = true;
							$scope.$digest();
						}, function(e){
							console.log('Encountered error: ' + e);
						});
					}
					request.send();
				})('./audio/one.mp3');
			}
		}//);
//});
