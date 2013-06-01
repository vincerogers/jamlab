"use strict";
//require(['js/Pedals/Pedal.js']);
(function(window, undefined){
	/**
	 * Distortion pedal utilizing pre gain, linear interpolation wave shaping, and a post gain
	 * @param webAudioContext
	 * @constructor
	 */
	var DistortionPedal = function(){

		Pedal.call(this);

		this.waveShaper = this.context.createWaveShaper();
		/*
		this.preGain = this.context.createGainNode();
		this.preGain.gain.value = 0.5;
		this.postGain = this.context.createGainNode();
		this.postGain.gain.value = 0.5;

		this.preGain.connect(this.waveShaper);
		this.waveShaper.connect(this.postGain);
		*/
		this.insertSignal(this.waveShaper);
		this.changeDistortion(0.95);
	};
	DistortionPedal.prototype = Object.create(Pedal.prototype);

	DistortionPedal.prototype.getInput = function(){
			return this.preGain;
	};
	DistortionPedal.prototype.getOutput = function(){
			return this.postGain;
	};
	DistortionPedal.prototype.changeDistortion = function(level){
		//http://stackoverflow.com/questions/7840347/web-audio-api-waveshapernode
		var sampleRate = this.context.sampleRate;
		var curve = new Float32Array(sampleRate);
		for(var i = 0; i < sampleRate; i++){
			var k = 2 * level / (1 - level);
			// LINEAR INTERPOLATION: x := (c - a) * (z - y) / (b - a) + y
			// a = 0, b = 2048, z = 1, y = -1, c = i
			var x = (i - 0) * (1 - (-1)) / (sampleRate - 0) + (-1);
			curve[i] = (1 + k) * x / (1+ k * Math.abs(x));
		}
		this.waveShaper.curve = curve;
	};

	DistortionPedal.prototype.getControlBindings = function(){
		var self = this;
		return new Array({
				name: "Pre Gain",
				min: 0,
				max: 1,
				defaultValue: 0.2,
				inc: 0.05,
				setMethod: this.setPreGain.bind(this)
			}, {
				name: "Distortion",
				min: 0,
				max: 1,
				defaultValue: 0.95,
				inc: 0.05,
				setMethod: this.changeDistortion.bind(this)
			}, {
				name: "Post Gain",
				min: 0,
				max: 1,
				defaultValue: 0.5,
				inc: 0.05,
				setMethod: this.setPostGain.bind(this)
			}
		);
	};

	window.DistortionPedal = DistortionPedal;
})(window);