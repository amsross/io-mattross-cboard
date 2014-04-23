/*global cBoard, JST */
'use strict';

cBoard.module('Layout', function (Layout, cBoard, Backbone) {

	// Layout Header View
	// ------------------
	Layout.Header = Backbone.Marionette.ItemView.extend({
		template: JST['private/templates/header.ejs'],

		events: {
			'click .canvas-clear': 'canvasClear'
		},

		canvasClear: function() {
			cBoard.vent.trigger('canvas:clear');
		}
	});

	// Layout Canvas View
	// ------------------
	Layout.Canvas = Backbone.Marionette.ItemView.extend({
		tagName: 'canvas',
		template: JST['private/templates/canvas.ejs'],

		events: {
			'mousedown': 'canvasDraw',
			'mousemove': 'canvasDraw',
			'mouseup': 'canvasDraw',
			'touchstart': 'canvasDraw',
			'touchmove': 'canvasDraw',
			'touchend': 'canvasDraw'
		},

		initialize: function() {

			var that = this;

			that.canvasData = {
				fillStyle: '#fff',
				fillColor: '#000000',
				radius: 1
			};
		},

		onShow: function() {

			var that = this;

			that.$el.height(window.innerHeight - cBoard.header.$el.height() - 3);

			that.canvasLoad();
			that.canvasClear();
		},

		canvasLoad: function() {

			var that = this;

			that.canvasData.canvas = that.$el[0];
			that.canvasData.objContainer = that.$el.parent();

			that.canvasData.canvas.width = that.canvasData.objContainer.innerWidth();
			that.canvasData.canvas.height = window.innerHeight - cBoard.header.$el.height() - 3;

			that.canvasData.ctx = that.canvasData.canvas.getContext('2d');
			that.canvasData.ctx.fillColor = that.canvasData.fillColor;
			that.canvasData.ctx.fillStyle = that.canvasData.fillStyle;
			that.canvasData.ctx.font = (that.canvasData.radius * 16) + 'px Arial';
			that.canvasData.ctx.lineCap = 'round';
			that.canvasData.ctx.lineWidth = that.canvasData.radius;
			that.canvasData.ctx.strokeStyle = that.canvasData.fillColor;
		},

		canvasClear: function() {

			var that = this;

			that.canvasData.ctx.fillRect(0, 0, that.canvasData.canvas.width, that.canvasData.canvas.height);

			that.img = new Image();

			that.img.src = '/img/field.jpg';

			that.img.onload	= function() {

				var iImgWidth = that.canvasData.canvas.width;
				var iImgHeight = that.canvasData.canvas.height;

				if ( that.img.width >  that.canvasData.canvas.width ||  that.img.height > that.canvasData.canvas.height ) {
					var resize_by_width = ((that.img.width / that.canvasData.canvas.width) > (that.img.height / that.canvasData.canvas.height));
					var resize_ratio = (resize_by_width ? that.canvasData.canvas.width / that.img.width : that.canvasData.canvas.height / that.img.height);

					iImgWidth = that.img.width * resize_ratio;
					iImgHeight = that.img.height * resize_ratio;
				} else {
					iImgWidth = that.img.width;
					iImgHeight = that.img.height;
				}

				if (that.canvasData.canvas.height > iImgHeight) {
					that.canvasData.canvas.height = that.canvasData.canvas.height = iImgHeight;
				}

				var offsetLeft = (that.canvasData.canvas.width - iImgWidth) / 2;
				var offsetTop = (that.canvasData.canvas.height - iImgHeight) / 2;
				that.canvasData.ctx.drawImage(that.img, offsetLeft, offsetTop, iImgWidth, iImgHeight );

				delete that.img;
			};
		},

		canvasDraw: function(e) {

			/* bugfix: http://code.google.com/p/android/issues/detail?id=5491 */
			/* bugfix: this also fixes the iPad issue where lines jump around between taps */
			e.preventDefault();

			var that = this,
				offset = that.canvasData.objContainer.offset(),
				coors = {
					x: 0,
					y: 0
				}
				;

			if (!e.originalEvent.targetTouches) {
				coors = {
					x: e.pageX - offset.left,
					y: e.pageY - offset.top
				};
			} else if (e.originalEvent.targetTouches[0]) {
				coors = {
					x: e.originalEvent.targetTouches[0].pageX - offset.left,
					y: e.originalEvent.targetTouches[0].pageY - offset.top
				};
			} else {
				coors = {};
			}

			that.canvasDrawer[e.type](coors, that);
		},

		canvasDrawer: {
			isDrawing: false,
			touchstart: function (coors, that) {
				this.mousedown(coors, that);
			},
			touchmove: function (coors, that) {
				this.mousemove(coors, that);
			},
			touchend: function (coors, that) {
				this.mouseup(coors, that);
			},
			mousedown: function (coors, that) {
				that.canvasData.ctx.beginPath();
				that.canvasData.ctx.moveTo(coors.x, coors.y);
				this.isDrawing = true;
			},
			mousemove: function (coors, that) {
				if(this.isDrawing === true) {
					that.canvasData.ctx.lineTo(coors.x, coors.y);
					that.canvasData.ctx.stroke();
				}
			},
			mouseup: function (coors, that) {
				if(this.isDrawing === true) {
					this.mousemove(coors, that);
					this.isDrawing = false;
				}
			}
		}
	});
});
