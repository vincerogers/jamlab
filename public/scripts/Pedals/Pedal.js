	(function(window, undefined){
		"use strict";
		/**
		 * @constructor
		 */
		var Pedal = function(){
			this.node = null;
			this.controls = new Array();
			this.context = JamLabWebAudioContext.getAudioContext();

			this.preGain = this.context.createGainNode();
			this.preGain.gain.value = 0.5;
			this.postGain = this.context.createGainNode();
			this.postGain.gain.value = 0.5;

			/* @TODO
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
			*/

		};

		Pedal.prototype.getInput = function(){
			return this.preGain;
		};
		Pedal.prototype.getOutput = function(){
			return this.postGain;
		};
		/**
		* Child objects create their own node paths and then insert into the pre/post gain structure by calling this method
		*/
		Pedal.prototype.insertSignal = function(firstNode, lastNode){
			this.preGain.connect(firstNode);
			if(lastNode !== undefined)
				lastNode.connect(this.postGain);
			else
				firstNode.connect(this.postGain);
		};
		Pedal.prototype.connect = function(connectTo){
			this.disconnect();
			this.getOutput().connect(connectTo.getInput());
		};
		Pedal.prototype.disconnect = function(){
			this.getOutput().disconnect();
		};
		Pedal.prototype.getControlBindings = function(){
			return new Array();
		};
		Pedal.prototype.setPreGain = function(value){
			this.preGain.gain.value = value;
		};
		Pedal.prototype.setPostGain = function(value){
			this.postGain.gain.value = value;
		};
		window.Pedal = Pedal;

	})(window);
