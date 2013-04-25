"use strict";

window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
window.context = new window.AudioContext();

requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js',
    paths: {
    	'angular': 'angular',
    	'jquery': 'http://code.jquery.com/jquery-1.9.1.js',
    	'jquery_ui': 'http://code.jquery.com/ui/1.10.2/jquery-ui.js',
    	'bootstrap': '../bootstrap/js/bootstrap.js'
    },
	shim: {
		'angular' : {'exports' : 'angular'},
	},
	priority: [
		'angular',
		'jquery',
		'jquery-ui',
		'bootstrap'
	],
});

require(['app'], function(app){
	console.log(app);
	app.run(['$rootScope', '$state', '$stateParams',
		function ($rootScope, $state, $stateParams) {
			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;
			console.log('State', $state);
			console.log('StateParams', $stateParams);
	}]);
});

var JamLab = {
	loadPedalModule: function(pedalType){
		require(pedalType);
	}
}


