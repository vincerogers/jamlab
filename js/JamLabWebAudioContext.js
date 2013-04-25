"use strict";

(function(window, undefined){
	var JamLabWebAudioContext = {
		getAudioContext: function(){
			return window.AudioContext || window.webkitAudioContext || window.mozAudioContext
		}
	};
	window.JamLabWebAudioContext = JamLabWebAudioContext;
})(window);