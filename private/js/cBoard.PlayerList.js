/*global cBoard */
'use strict';

cBoard.module('PlayerList', function (PlayerList, cBoard, Backbone, Marionette, $, _) {

	// PlayerList Router
	// ---------------
	//
	// Handle routes to show the active vs complete player items
	PlayerList.Router = Marionette.AppRouter.extend({
		appRoutes: {}
	});

	// PlayerList Controller (Mediator)
	// ------------------------------
	//
	// Control the workflow and logic that exists at the application
	// level, above the implementation detail of views and models
	PlayerList.Controller = function () {
		this.playerList = new cBoard.Players.PlayerList();
	};

	_.extend(PlayerList.Controller.prototype, {
		// Start the app by showing the appropriate views
		// and fetching the list of player items, if there are any
		start: function () {
			this.showHeader();
			this.showCanvas();
			this.showPlayerList(this.playerList);
		},

		showHeader: function () {
			var header = new cBoard.Layout.Header({});
			cBoard.header.show(header);
		},

		showCanvas: function () {
			var canvas = new cBoard.Layout.Canvas({});
			cBoard.canvas.show(canvas);
		},

		showPlayerList: function (playerList) {
			cBoard.players.show(new PlayerList.Views.ListView({
				collection: playerList
			}));
		}
	});

	// PlayerList Initializer
	// --------------------
	//
	// Get the PlayerList up and running by initializing the mediator
	// when the the application is started, pulling in all of the
	// existing Player items and displaying them.
	PlayerList.addInitializer(function () {
		var controller = new PlayerList.Controller();
		controller.router = new PlayerList.Router({
			controller: controller
		});

		controller.start();
	});
});
