/*
 * Module dependencies
 */
var _ = require('underscore'),
	central_render = function(req, res, params) {
		'use strict';
		res.status(params.status||200).render(params.template||'', _.extend({
			body_class: params.body_class||'',
			env: params.env||req.NODE_ENV,
			menu: params.menu||'',
			message: params.message||'',
			title: params.title ? params.title + ' &raquo; ' : ''
		}, params.addons));
	};

/*
 * GET home page.
 */
exports.index = function(req, res){
	'use strict';

	central_render(req, res, {
		body_class: 'home',
		menu: 'home',
		template: 'index'
	});
};
