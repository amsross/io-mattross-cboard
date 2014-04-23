/*global cBoard */
'use strict';

cBoard.module('Players', function (Players, cBoard, Backbone) {

	// Player Model
	// ----------
	Players.Player = Backbone.Model.extend({
		defaults: {
			number: 0,
			name: ''
		}
	});

	// Player Collection
	// ---------------
	Players.PlayerList = Backbone.Collection.extend({
		model: Players.Player,

		localStorage: new Backbone.LocalStorage('players-backbone-marionette')
	});
});
