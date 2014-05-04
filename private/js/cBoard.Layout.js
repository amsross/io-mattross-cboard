/*global cBoard, JST, google */
'use strict';

cBoard.module('Layout', function (Layout, cBoard, Backbone) {

	// Layout Header View
	// ------------------
	Layout.Header = Backbone.Marionette.ItemView.extend({
		template: JST['private/templates/header.ejs'],

		ui: {
			mapSet: '.map-set',
			mapEdit: '.map-edit',
			mapLocate: '.map-locate',
			mapRotateR: '.map-rotate-r',
			mapRotateL: '.map-rotate-l'
		},

		events: {
			'click .canvas-clear': 'canvasClear',
			'click .map-toggle': 'toggleEdit',
			'click .map-locate-gps': 'locateGps',
			'click .map-locate-default': 'locateDefault',
			'click .map-rotate-r': 'rotateRight',
			'click .map-rotate-l': 'rotateLeft'
		},

		onShow: function() {
			
			var that = this;

			if (!navigator.geolocation) {
				that.ui.mapLocate.remove();
			}
		},

		canvasClear: function() {
			cBoard.vent.trigger('canvas:clear');
		},

		toggleEdit: function() {
			$('body').toggleClass('map-editing');
		},

		locateDefault: function() {
			cBoard.map.currentView.resetLocation();
		},

		locateGps: function() {
			cBoard.map.currentView.getLocation();
		},

		rotateRight: function() {

			var map = cBoard.map.currentView.map;

			map.setHeading((map.getHeading()||0) - 90);
		},
		rotateLeft: function() {

			var map = cBoard.map.currentView.map;

			map.setHeading((map.getHeading()||0) + 90);
		}
	});

	// Layout Canvas View
	// ------------------
	Layout.Map = Backbone.Marionette.ItemView.extend({
		tagName: 'div',
		template: JST['private/templates/map.ejs'],

		initialize: function() {

			var that = this;

			that.mapOptions = {
				disableDefaultUI: true,
				center: new google.maps.LatLng(39.85026448084963, -74.92485770796928),
				mapTypeId: google.maps.MapTypeId.SATELLITE,
				tilt: 45,
				zoom: 20
			};

			that.showMap();
		},

		onShow: function() {
			
			var that = this,
				canvas = cBoard.canvas.currentView,
				$canvas = canvas.$el
				;

			that.$el.height($canvas.innerHeight());
			that.$el.width($canvas.innerWidth());
		},

		resetLocation: function() {
			this.initialize();
		},

		getLocation: function() {
			
			var that = this;
			
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					that.showPosition(position, that);
				});
			} else {
				that.showMap();
			}
		},

		showPosition: function(position, self) {

			var that = self;

			that.mapOptions.center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			
			that.showMap();
		},

		showMap: function() {

			var that = this;

			that.map = new google.maps.Map(that.el, that.mapOptions);
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
				fillStyle: '#ffffff',
				fillColor: '#ffffff',
				strokeStyle: '#000000',
				radius: 1
			};
		},

		onShow: function() {

			var that = this,
				map = new cBoard.Layout.Map({})
				;

			that.canvasLoad();
			that.canvasClear();

			cBoard.map.show(map);
		},

		markerAttach: function(coors) {
			
			var that = this;
			
			cBoard.attaching.$el.removeClass('attaching');
			
			console.log(cBoard.attaching);
			console.log(cBoard.attaching.marker);
			if (cBoard.attaching.marker) {
				cBoard.attaching.marker.close();
			}
			
			cBoard.attaching.marker = new cBoard.PlayerList.Views.ItemMarkerView({model: cBoard.attaching.model, coors: coors});
			that.canvasData.objContainer.append(cBoard.attaching.marker.render().el);
			cBoard.attaching = null;
		},

		canvasLoad: function() {

			var that = this;

			that.canvasData.canvas = that.$el[0];
			that.canvasData.objContainer = that.$el.parent();
			that.canvasData.ctx = that.canvasData.canvas.getContext('2d');
		},

		canvasClear: function() {

			var that = this;

			that.canvasData.canvas.width = that.canvasData.objContainer.innerWidth();
			that.canvasData.canvas.height = window.innerHeight - cBoard.header.$el.height() - 3;

			that.canvasData.ctx.fillColor = that.canvasData.fillColor;
			that.canvasData.ctx.fillStyle = that.canvasData.fillStyle;
			that.canvasData.ctx.font = (that.canvasData.radius * 16) + 'px Arial';
			that.canvasData.ctx.lineCap = 'round';
			that.canvasData.ctx.lineWidth = that.canvasData.radius;
			that.canvasData.ctx.strokeStyle = that.canvasData.strokeStyle;

			//that.canvasData.ctx.fillRect(0, 0, that.canvasData.canvas.width, that.canvasData.canvas.height);

			that.img = new Image();

			//that.img.src = 'img/field.jpg';

			that.img.onload	= function() {

				var
					iImgHeight = that.canvasData.canvas.height,
					iImgWidth = that.canvasData.canvas.width,
					offsetLeft = 0,
					offsetTop = 0,
					resize_by_width = false,
					resize_ratio = 1
					;

				if ( that.img.width > that.canvasData.canvas.width || that.img.height > that.canvasData.canvas.height ) {
					resize_by_width = ((that.img.width / that.canvasData.canvas.width) > (that.img.height / that.canvasData.canvas.height));
					resize_ratio = (resize_by_width ? that.canvasData.canvas.width / that.img.width : that.canvasData.canvas.height / that.img.height);

					iImgWidth = that.img.width * resize_ratio;
					iImgHeight = that.img.height * resize_ratio;
				} else {
					iImgWidth = that.img.width;
					iImgHeight = that.img.height;
				}

				if (that.canvasData.canvas.height > iImgHeight) {
					that.canvasData.canvas.height = iImgHeight;
				}

				offsetLeft = (that.canvasData.canvas.width - iImgWidth) / 2;
				offsetTop = (that.canvasData.canvas.height - iImgHeight) / 2;
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
				
				if (cBoard.attaching) {
					that.markerAttach(coors);
				} else {
					that.canvasData.ctx.beginPath();
					that.canvasData.ctx.moveTo(coors.x, coors.y);
					this.isDrawing = true;
				}
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
