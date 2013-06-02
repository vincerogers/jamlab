require(['scripts/Pedals/Pedal.js'], function(){
	(function(window, undefined){
		"use strict";
		var ReverbPedal = function(){
			Pedal.call(this);
			this.node = this.context.createConvolver();
			this.insertSignal(this.node);
		};
		ReverbPedal.prototype = Object.create(Pedal.prototype);

		window.ReverbPedal = ReverbPedal;
	})(window);
});