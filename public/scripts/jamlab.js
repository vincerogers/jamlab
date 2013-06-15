requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'scripts',
    paths: {
    	'angular': '../components/angular/angular',
    	'jquery': '../components/jquery/jquery',
    	'jquery_ui': '../components/jquery-ui/ui/jquery-ui',
    	'bootstrap': '../bootstrap/js/bootstrap.js',
    	'Pedal': 'Pedals/Pedal',
    	'Speaker': 'Pedals/Speaker'
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

require(['JamLabWebAudioContext'], function(){
	require(['Pedal'], function(){
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


