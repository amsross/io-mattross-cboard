/*global cBoard, JST, Faker */
'use strict';

cBoard.module('PlayerList.Views', function (Views, cBoard, Backbone, Marionette) {

	// Player List Item View
	// -------------------
	//
	// Display an individual player item, and respond to changes
	// that are made to the item, including marking completed.
	Views.ItemView = Marionette.ItemView.extend({
		tagName: 'li',
		className: 'clearfix pure-u-1',
		template: JST['private/templates/playerItemView.ejs'],

		ui: {
			number: '.number',
			name: '.name',
		},

		events: {
			'click .destroy': 'destroy',
			'click .number': 'destroy',
		},

		modelEvents: {},

		destroy: function () {
			this.model.destroy();
		}
	});

	// Item List View
	// --------------
	//
	// Controls the rendering of the list of items, including the
	// filtering of activs vs completed items for display.
	Views.ListView = Backbone.Marionette.CompositeView.extend({
		template: JST['private/templates/playerListCompositeView.ejs'],
		itemView: Views.ItemView,
		itemViewContainer: '.players',

		ui: {
			playerAdd: '.player-add'
		},

		events: {
			'click .player-add': 'playerAdd'
		},

		collectionEvents: {
			'add': 'playerSave'
		},

		onShow: function () {

			var that = this;

			that.$('.players').slimScroll({
				height: window.innerHeight - that.ui.playerAdd.innerHeight() - cBoard.header.$el.innerHeight() - 3 + 'px'
			});
		},

		playerAdd: function () {

			var that = this;

			that.collection.add({
				'number': Math.floor(Math.random() * (150 - 1) + 1),
				'name': Faker.Name.findName()
			}, {at: 0});
		},

		playerSave: function (player) {
			player.save();
		}
	});
});
