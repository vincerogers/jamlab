"use strict";
//require(['js/Pedals/Pedal.js']);
(function(window, undefined){
	var CompressionPedal = function(){
		Pedal.call(this);
		this.node = context.createDynamicsCompressor();
	};
	CompressionPedal.prototype = Object.create(Pedal.prototype);
	CompressionPedal.prototype.getControlBindings = function(){
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
	window.CompressionPedal = CompressionPedal;
})(window);