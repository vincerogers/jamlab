(function(window, undefined){
	"use strict";
	var DelayPedal = function(){
		Pedal.call(this);
		this.input = this.context.createGain();
		this.delay = this.context.createDelay();
		this.dry = this.context.createGain();
		this.dry.gain.value = 0.5;
		this.output = this.context.createGain();

		this.input.connect(this.dry);
		this.input.connect(this.delay);

		this.dry.connect(this.output);
		this.delay.connect(this.output);

		this.delay.delayTime =

		this.insertSignal(this.input, this.output);
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
				setMethod: function(value){self.delay.delayTime.value = value}
			},{name: 'Mix',
				min: 0,
				max: 1,
				defaultValue: 0.5,
				inc: 0.05,
				setMethod: function(value){self.dry.gain.value = value}
			}
		);
	};
	window.DelayPedal = DelayPedal;
})(window);