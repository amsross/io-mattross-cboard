
module.exports = function () {
	'use strict';

	/**
	 * Module dependencies.
	 */
	var express = require('express'),
		bodyParser = require('body-parser'),
		cookieParser = require('cookie-parser'),
		session = require('express-session'),
		favicon = require('static-favicon'),
		path = require('path'),
		routes = require('./routes'),
		app = express()
		;

	// production only
	if ('production' === app.get('env')) {
		console.log('env: production');
		require('newrelic');
	}

	// development only
	if ('production' !== app.get('env')) {
		// app.use(express.errorHandler());
		app.use(function(req, res, next){
			console.log('%s %s', req.method, req.url);
			next();
		});
	}

	// all environments
	app.set('port', process.env.PORT || 3000);
	app.set('view engine', 'jade');
	app.set('views', path.join(__dirname, 'views'));

	app.use(bodyParser());
	app.use(cookieParser());
	app.use(session({
		secret: 'asfjaeifleijfwqehflqkjefiwef',
		key: 'io-mattross-cboard',
		cookie: { secure: true }
	}));
	app.use(favicon(__dirname + '/favicon.ico'));

	app.use(function (req, res, next) {
		res.set('X-Powered-By', 'mattross.io');
		next();
	});
	app.use(function (req, res, next) {
		// make the environment name available in routes, etc
		req.NODE_ENV = app.get('env');

		next();
	});

	app.use(express.static(path.join(__dirname, 'public')));

	app.locals._ = require('underscore');

	app.get('/', routes.index);

	return app;
};
