"use strict";

(function(window, undefined){

	window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
	var context = new window.AudioContext();

	/**
	 *
	 * @param webAudioContext
	 * @constructor
	 */
	var Pedal = function(){
		this.node = null;
		this.controls = new Array();

		var bypass = false;
		var bypassNode = null;
		this.toggleBypass = function(){
			bypass = !bypass;
			if(bypassNode == null)
				bypassNode = createJavaScriptNode(); //dummy pass through node
			if(bypass){
				//swap out nodes somehow
			}
		}

	};

	Pedal.prototype = {
		getInput: function(){
			return this.node;
		},
		getOutput: function(){
			return this.node;
		},
		connect: function(connectTo){
			this.getOutput().disconnect();
			this.getOutput().connect(connectTo.getInput());
		},
		getControlBindings: function(){
			return new Array();
		}
	};
	window.Pedal = Pedal;

	var ReverbPedal = function(){
		Pedal.call(this);
		this.node = context.createConvolver();
	};
	ReverbPedal.prototype = Object.create(Pedal.prototype);

	window.ReverbPedal = ReverbPedal;

	/**
	 * Distortion pedal utilizing pre gain, linear interpolation wave shaping, and a post gain
	 * @param webAudioContext
	 * @constructor
	 */
	var DistortionPedal = function(){

		Pedal.call(this);
		this.waveShaper = context.createWaveShaper();
		this.preGain = context.createGainNode();
		this.preGain.gain.value = 0.5;
		this.postGain = context.createGainNode();
		this.postGain.gain.value = 0.5;

		this.preGain.connect(this.waveShaper);
		this.waveShaper.connect(this.postGain);

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
		var sampleRate = context.sampleRate;
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
	DistortionPedal.prototype.setPreGain = function(value){
		console.log("PREGAIN " + value);
		this.preGain.gain.value = value;
	};
	DistortionPedal.prototype.setPostGain = function(value){
		this.postGain.gain.value = value;
				console.log("POSTGAIN " + value);
	};

	window.DistortionPedal = DistortionPedal;

	var Speaker = function(){
		Pedal.call(this);
		this.node = context.destination;
	};
	Speaker.prototype = Object.create(Pedal.prototype);

	Speaker.prototype.getInput = function(){
		return context.destination;
	};
	Speaker.prototype.getOutput = function(){
		throw ("A speaker cannot have an output line");
	};
	Speaker.prototype.connect = function(){
		throw ("A speaker object cannot connect to anything");
	};

	window.Speaker = Speaker;


	var CompressorPedal = function(){
		Pedal.call(this);
		this.node = context.createDynamicsCompressor();
	};
	CompressorPedal.prototype = Object.create(Pedal.prototype);
	CompressorPedal.prototype.getControlBindings = function(){
		var self = this;
		return new Array({
				name: "Threshold",
				min: -100,
				max: 0,
				defaultValue: -24,
				inc: 0.1,
				setMethod: function(value){self.node.threshhold = value}
			}, {
				name: "Knee",
				min: 0,
				max: 40,
				defaultValue: 30,
				inc: 1,
				setMethod: function(value){self.node.knee = value}
			}, {
				name: "Ratio",
				min: 1,
				max: 20,
				defaultValue: 12,
				inc: 0.05,
				setMethod: function(value){self.node.ratio = value}
			}, {
				name: 'Attack',
				min: 0,
				max: 1,
				defaultValue: 0.003,
				inc: 0.001,
				setMethod: function(value){self.node.attack = value}
			}, {
				name: 'Release',
				min: 0,
				max: 1,
				defaultValue: 0.250,
				inc: 0.05,
				setMethod: function(value){self.node.release = value}
			}
		);
	};


	window.CompressorPedal = CompressorPedal;

	/**
	 * @param (AudioSource) source
	 * @param (AudioDestination) destination
	 * @constructor
	 */
	var SoundBoard = function(inputBuffer){
		this.audioSource = null;
		this.speaker = new Speaker();
		this.muted = true;
		this.nodes = [];
		this.inputBuffer = null;

		if(typeof inputBuffer !== 'undefined')
			this.setBuffer(inputBuffer);
	};

	SoundBoard.prototype = {
		setBuffer: function(inputBuffer){
			this.inputBuffer = inputBuffer;
			this.audioSource = context.createBufferSource();
			this.audioSource.buffer = inputBuffer;
			this.audioSource.connect(this.speaker.getInput());
		},
		unMute: function(){
			if(this.muted == false)
				throw ("Cannot unmute a soundboard that is not muted");
			this.setBuffer(this.inputBuffer);
			this.audioSource.start(0);
			console.log('Playing Sample ' + this.audioSource);
			this.muted = false;
		},
		mute: function(){
			if(this.muted == true)
				throw ("Cannot mute a soundboard that already muted");
			this.audioSource.stop(0);
			console.log('Stopping Sample');
			this.muted = true;
		},
		addPedalToEnd: function(pedal){
			this.insertPedal(pedal);
		},
		insertPedal: function(pedal, index){
			//default parameter value for index
			if(typeof index === 'undefined'){
				index = this.nodes.length;
			} else{
				this.checkIndex(index);
			}

			var firstPedal = index === 0;
			var lastPedal = index === this.nodes.length;

			this.nodes.splice(index, 0, pedal);
			if (!firstPedal) {
				this.nodes[index - 1].connect(pedal);
			} else {
				this.audioSource.connect(pedal.getInput());
			}

			if(lastPedal){ //pedal at end, connect to output
				pedal.connect(this.speaker);
			} else{ //pedal inserted beginning or middle, output to next pedal in the chain
				pedal.connect(this.nodes[index + 1]);
			}

		},
		removePedal: function(index){
			this.checkIndex(index);
			var prev = this.isFirstPedal(index) ? this.audioSource : this.nodes[index-1];
			var next = this.isLastPedal(index) ? this.speaker : this.nodes[index+1];
			prev.connect(this.isFirstPedal(index) ? next.getInput() : next); //hack, need to refactor to make this cleaner
			this.nodes.splice(index) ;
		},
		checkIndex: function(index){
			if(index > this.nodes.length || index < 0)
				throw ('Invalid index ' + index + '. The current pedal count is ' + this.nodes.length + '.');
		},
		isFirstPedal: function(index){
			return index === 0;
		},
		isLastPedal: function(index){
			return index === this.nodes.length - 1;
		}
	};
	window.SoundBoard = SoundBoard;

	var Collection = function(){
		this.items = {};
		this.indexes = [];
	}

	Collection.prototype = {
		addItem: function(item, index){
			this.items[index] = item;
			this.indexes.push(index);
		},
		removeItem: function(index){
			delete this.items.index;
			this.indexs.splice(index, 1);
		},
		itemAt: function(){
			return this.items.index;
		},
		findIndex: function(){

		}
	}
	window.Collection = Collection;
})(window);

