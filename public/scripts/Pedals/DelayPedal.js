"use strict";
(function(window, undefined){
	var DelayPedal = function(){
		Pedal.call(this);
		this.node = this.context.createDelay();
		this.insertSignal(this.node);
	};
	DelayPedal.prototype = Object.create(Pedal.prototype);
	DelayPedal.prototype.getControlBindings = function(){
		var self = this;
		return new Array({
				name: 'Delay',
				min: 0,
				max: 5,
				defaultValue: 0,
				inc: 0.05,
				setMethod: function(value){self.node.delayTime = value}
			}
		);
	};
	window.DelayPedal = DelayPedal;
})(window);