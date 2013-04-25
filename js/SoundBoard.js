"use strict";
require(['JamLabWebAudioContext', 'Pedals/Speaker'], function(){
	(function(window, undefined){

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
				this.context = JamLabWebAudio.getAudioContext();
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


				if (!firstPedal) {
					this.nodes[index - 1].connect(pedal);
					this.nodes.splice(index, 0, pedal);
				} else {
					console.log("First pedal");
					this.audioSource.connect(pedal.getInput());
					this.nodes[0] = pedal;
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
				console.log(prev);
				console.log(next);
				prev.disconnect();
				prev.connect(this.isFirstPedal(index) ? next.getInput() : next); //hack, need to refactor to make this cleaner
				this.nodes.splice(index, 1);
				console.log(this.nodes);
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
	})(window);
});
