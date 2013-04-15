/**
 * Created with JetBrains WebStorm.
 * User: Vince
 * Date: 3/2/13
 * Time: 11:06 PM
 * To change this template use File | Settings | File Templates.
 */
var buff;
function mainController($scope){
	$scope.pedals = new Array();
	$scope.board = new SoundBoard();
	$scope.pedalTypes = new Array(
		{id: 'distortion', name: 'distortion'},
		{id:'reverb', name: 'reverb'}
	);
	$scope.selectedPedal = null;

	/////////////////////////////////////////////
	/////////////////////////////////////////////
	$scope.vid;
	$scope.aStream = new JamAudioStream();
	$scope.vStream = new JamVideoStream();
	$scope.vStream.onStreamReady(function(stream){
		$scope.video.src(webkitURL.createObjectURL(stream));
		//$scope.videoStreamURL = webkitURL.createObjectURL(stream);
		$scope.$apply();
	});
	/////////////////////////////////////////////
	/////////////////////////////////////////////

	$scope.startAudioStream = function(){
		$scope.aStream.connectUserMedia();
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

	$scope.addDistortionPedal = function(){
		$scope.board.addPedalToEnd(new DistortionPedal());
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
		console.log("starting load");
		var context = new webkitAudioContext();
		(function loadSample(url) {
			var request = new XMLHttpRequest();
			request.open('GET', url, true);
			request.responseType = 'arraybuffer';

			// Decode asynchronously
			request.onload = function() {
				context.decodeAudioData(request.response, function(buffer){
					buff = buffer;
					$scope.board.setBuffer(buffer);
					console.log("buffer set");
				}, function(e){
					console.log('Encountered error: ' + e);
				});
			}
			request.send();
		})('./audio/one.mp3');
	}
}

function pedalsController($scope){

}
