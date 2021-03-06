(function(window, undefined){
	"use strict";
	var audioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
	var obj = null;

	var JamLabWebAudioContext = {
		getAudioContext: function(){
			if(obj == null){
				obj = new audioContext();
			}
			return obj;
		}
	};
	window.JamLabWebAudioContext = JamLabWebAudioContext;
})(window);