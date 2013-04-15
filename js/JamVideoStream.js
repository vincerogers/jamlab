 /* Created with JetBrains WebStorm.
 * User: Vince
 * Date: 3/2/13
 * Time: 8:32 PM
 * To change this template use File | Settings | File Templates.
 */
var JamVideoStream = function(){
	var stream = null;
	var self = this;
	var connected = false;
	this.onReady = [];

	this.connectUserMedia = function(){
		navigator.webkitGetUserMedia({video: true}, this.startUserMedia, function(e) {
			 console.log('No live video input: ' + e);
		 });
	}

	this.startUserMedia = function(stream){
		self.stream = stream;
		self.connected = true;
        console.log("firing callback");
		self.onReady.forEach(function(f){
			f(stream);
		});
	}

	this.disconnectUserMedia = function(){
		if(!this.connected)
			throw "Stream is not connected";
		this.input.disconnect();
		this.input.stop();
		this.connected = false;
	}

	this.onStreamReady = function(f){
		this.onReady.push(f);
	}

}


