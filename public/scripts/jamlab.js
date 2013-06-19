requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'scripts',
    paths: {
    	'angular': '../components/angular/angular',
    	'jquery': '../components/jquery/jquery',
    	'jquery_ui': '../components/jquery-ui/ui/jquery-ui',
    	'bootstrap': '../bootstrap/js/bootstrap.js',
    	'recorder': '../components/Recorderjs/recorder',
    	'jQuery-Knob': '../components/jQuery-Knob/js/jquery.knob',
    	'Pedal': 'Pedals/Pedal',
    	'Speaker': 'pedals/Speaker'
    },
	shim: {
		'angular' : {'exports' : 'angular'},
	},
	priority: [
		'Pedal',
		'Speaker',
		'angular',
		'jquery',
		'jquery-ui',
		'bootstrap'
	],
});

require(['JamLabWebAudioContext', 'recorder', 'jquery'], function(){
	require(['Pedal', 'jQuery-Knob'], function(){
		require(['Speaker'], function(){
			require(['SoundBoard'], function(){
				require(['app'], function(app){
					app.init();
				});
			});
		});
	});
});

var JamLab = {
	loadPedalModule: function(pedalType){
		require(["Pedals/" + pedalType]);
	}
}

var pr = function(message){
	console.log(message);
}


