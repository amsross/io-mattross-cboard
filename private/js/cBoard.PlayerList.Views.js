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
			'click .name': 'edit',
		},

		modelEvents: {},

		edit: function() {

			var that = this;

			cBoard.players.show(new cBoard.PlayerList.Views.ItemEdit({model: that.model}));
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
			'click .player-destroy': 'destroy',
			'blur .name': 'blur',
			'blur .number': 'blur',
			'focus .name': 'focus',
			'focus .number': 'focus',
			'change .name': 'change',
			'change .number': 'change',
		},
		
		blur: function(evt) {

			var that = this,
				target = evt.currentTarget,
				$target = $(target)
				;

			if ($target.hasClass('name') && $target.val().length < 1) {
				$target.val(that.model.get('name'));
			} else if ($target.hasClass('number') && $target.val().length < 1) {
				$target.val(that.model.get('number'));
			}
		},
		
		focus: function(evt) {

			var that = this,
				target = evt.currentTarget,
				$target = $(target)
				;

			if ($target.hasClass('name') && $target.val() === that.model.get('name')) {
				$target.val('');
			} else if ($target.hasClass('number') && +$target.val() === +that.model.get('number')) {
				$target.val('');
			}
		},

		change: function() {

			var that = this;

			that.model.set({
				'name': that.ui.name.val(),
				'number': that.ui.number.val()
			});
		},

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
		},

		onShow: function () {

			var that = this,
				scrollHeight = window.innerHeight - that.ui.playerAdd.innerHeight() - cBoard.header.$el.innerHeight() - 4
				;

			that.collection.fetch();

			that.$('.players').slimScroll({
				height: scrollHeight
			});
		},

		playerAdd: function () {

			var that = this,
				player = new cBoard.Players.Player({
					'number': Math.floor(Math.random() * (150 - 1) + 1),
					'name': Faker.Name.findName(),
				}, {
					collection: that.collection
				})
				;

			cBoard.players.show(new cBoard.PlayerList.Views.ItemEdit({model: player}));
		}
	});
});
