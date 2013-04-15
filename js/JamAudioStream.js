 /* Created with JetBrains WebStorm.
 * User: Vince
 * Date: 3/2/13
 * Time: 8:32 PM
 * To change this template use File | Settings | File Templates.
 */
var JamAudioStream = function(){
	var stream = null;
	var input = null;
	var audioContext = null;
	var chain = [];
	var self = this;
	var connected = false;

	this.connectUserMedia = function(){
		 try{
			 // webkit shim
			 window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
			 navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
			 window.URL = window.URL || window.webkitURL || window.mozURL;

			 this.audioContext = new AudioContext();
			 console.log('Audio context set up.');
			 console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
		 }catch(e){
			 console.warn('No web audio support in this browser!');
		 }

		 navigator.getUserMedia({audio: true}, this.startUserMedia, function(e) {
			 console.log('No live audio input: ' + e);
		 });
	}

	this.startUserMedia = function(stream){
		self.input = self.audioContext.createMediaStreamSource(stream);
		var volume = self.audioContext.createGainNode();

		volume.gain.value = 0.2;
		volume.connect(self.audioContext.destination);
		self.input.connect(volume);
		self.connected = true;
	}

	this.disconnectUserMedia = function(){
		if(!this.connected)
			throw "Stream is not connected";
		this.input.disconnect();
		this.connected = false;
	}

}


