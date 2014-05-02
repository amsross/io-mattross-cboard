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
			'click .number': 'destroy',
		},

		modelEvents: {},

		destroy: function () {
			this.model.destroy();
		}
	});

	Views.ItemEdit = Marionette.ItemView.extend({
		tagName: 'form',
		className: 'clearfix pure-u-1 pure-form',
		template: JST['private/templates/playerItemEdit.ejs'],

		ui: {
			number: '.number',
			name: '.name',
		},

		events: {
			'click .player-queue': 'queue',
			'click .player-cancel': 'destroy',
		},

		modelEvents: {},

		queue: function () {

			var that = this;

			that.model.collection.add(that.model);

			that.model.save();

			cBoard.players.show(new cBoard.PlayerList.Views.ListView({
				collection: that.model.collection
			}));
		},

		destroy: function () {

			var that = this;

			that.model.destroy();

			cBoard.players.show(new cBoard.PlayerList.Views.ListView({
				collection: new cBoard.Players.PlayerList(that.model.collection)
			}));
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

			that.collection.fetch();

			that.$('.players').slimScroll({
				height: window.innerHeight - that.ui.playerAdd.innerHeight() - cBoard.header.$el.innerHeight() - 3 + 'px'
			});
		},

		playerAdd: function () {
			console.log('playerAdd');

			var that = this,
				player = new cBoard.Players.Player({
					'number': Math.floor(Math.random() * (150 - 1) + 1),
					'name': Faker.Name.findName(),
				}, {
					collection: that.collection
				})
				;

			cBoard.players.close();
			cBoard.players.show(new cBoard.PlayerList.Views.ItemEdit({model: player, parent: that}));
		},

		playerSave: function (player) {
			player.save();
		}
	});
});
