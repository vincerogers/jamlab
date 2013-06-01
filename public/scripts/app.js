define(['angular', 'jquery', 'jquery_ui'], function (angular) {
	'use strict';
	var angularModule = (angular.module('jamlab', []).
	config(['$routeProvider', function($routeProvider){
		$routeProvider.
			when('/', {templateUrl: 'views/main.html', controller: MainController}).
			//when('/:categoryId', {templateUrl: 'partials/category.html', controller: categoryCtrl}).
			//when('/pedals/:pedalId', {templateUrl: 'partials/pedalTemplate.html', controller: pedalsController}).
			otherwise({
				redirectTo: '/'
			})
	}]).directive('controlSet', function() {
			return function(scope, element, attrs) {
				var pedal = scope.pedal;
				var pedalControls = pedal.pedal.getControlBindings();
				for(var x = 0; x < pedalControls.length; x++){
					var controlId = "control_" + pedal.id + "_" + x;
					(function(control){
						angular.element(element).append(control.name + "<div id = '" + controlId + "'></div>");
						 $("#" + controlId).slider({
							range: "min",
							min: control.min,
							max: control.max,
							step: control.inc,
							value: control.defaultValue,
							slide: function( event, ui ) {
								control.setMethod(ui.value);
							}
						});
					})(pedalControls[x]);
				}
			}
		}));
	var app = {};
	app.init = function init() {
	  //using global angular var
	  angular.bootstrap(document, ['jamlab']);
	};

	//https://github.com/btilford/jam-plus-angular
	//make the "todomvc" (Angular) module available on the "app" (AMD) module
	app.__defineGetter__('jamlab', function() {return angularModule;});
	return app;
});