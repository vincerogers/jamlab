"use strict";

(function(window, undefined){
	/**
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
			this.disconnect();
			this.getOutput().connect(connectTo.getInput());
		},
		disconnect: function(){
			this.getOutput().disconnect();
		},
		getControlBindings: function(){
			return new Array();
		}
	};
	window.Pedal = Pedal;

})(window);