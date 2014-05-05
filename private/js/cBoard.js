/*global Backbone */
'use strict';

var cBoard = new Backbone.Marionette.Application();

cBoard.addRegions({
	header: '#header',
	canvas: '#canvas',
	map: '#map',
	players: '#players'
});

cBoard.on('initialize:after', function () {
	Backbone.history.start();
});


// Application Event Handlers
// --------------------------
cBoard.vent.on('canvas:clear', function () {});
