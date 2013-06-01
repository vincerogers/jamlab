"use strict";

	(function(window, undefined){
		var Speaker = function(){
			Pedal.call(this);
			this.node = (JamLabWebAudioContext.getAudioContext().destination);
		};
		Speaker.prototype = Object.create(Pedal.prototype);

		Speaker.prototype.getInput = function(){
			return this.node;
		};
		Speaker.prototype.getOutput = function(){
			throw ("A speaker cannot have an output line");
		};
		Speaker.prototype.connect = function(){
			throw ("A speaker object cannot connect to anything");
		};

		window.Speaker = Speaker;
	})(window);