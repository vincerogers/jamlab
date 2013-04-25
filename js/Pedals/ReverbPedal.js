"use strict";
require(['js/Pedals/Pedal.js'], function(){
	(function(window, undefined){
		var ReverbPedal = function(){
			Pedal.call(this);
			this.node = context.createConvolver();
		};
		ReverbPedal.prototype = Object.create(Pedal.prototype);

		window.ReverbPedal = ReverbPedal;
	})(window);
});