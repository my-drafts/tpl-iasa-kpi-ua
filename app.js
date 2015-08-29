#!/usr/bin/env node

var hapi = require('hapi');
var handlebars = require('handlebars');
var nunjucks = require('nunjucks');
var jinja = require('jinja');
var path = require('path');
var fs = require('fs');
var mime = require('mime');
var mc = require('mongodb').MongoClient;
var mdb = undefined;
var mcp = require('./config').mongoConnectionString();

var server = new hapi.Server({
	app: {
		host: 'localhost',
		port: parseInt(process.env.PORT, 3000) || 3000,
		langs: ['uk', 'ru', 'en'],
		lang: 'uk',
		root: __dirname,
		storage: __dirname + '/storage',
		template: 'iasa',
		user: 'guest'
	},
	debug: {
		request: ['error', 'log']
	},
	load: {
		sampleInterval: 1000
	}
});

server.connection({
	host: server.settings.app.host,
	port: server.settings.app.port
});

server.path(server.settings.app.storage);

server.register(require('inert'), function (error) {
	if (error) throw error;
	console.log(['log'], 'Inert loaded');
});

server.register(require('vision'), function (error) {
	if (error) throw error;
	console.log(['log'], 'Vision loaded');
	server.views({
		relativeTo: server.settings.app.storage,
		path: './templates/default',
		//layoutPath: './templates/default/layout',
		//helpersPath: './templates/default/helper',
		allowAbsolutePaths: false,
		//layout: 'layout-index',
		engines: {
			shtml: handlebars,
			html: jinja,
			xhtml: {
				compile: function (src, options) {
					var template = nunjucks.compile(src, options.environment);
					return function (context) {
						return template.render(context);
					};
				},
				prepare: function (options, next) {
					options.compileOptions.environment = nunjucks.configure(options.path, {watch: false});
					return next();
				}
			}
		}
	});
});

//server.log();

//server.initialize(function (error) {
//	console.log(['log'], 'hapi initialize ...');
//});

server.start(function (err){
	console.log(['log'], 'Server started at: ' + server.info.uri);
});

server.route({
	method: 'GET',
	path: '/test/{path*}',
	handler: function (req, res) { res('Test: ok!\n' + req.params.path).type('text/plain'); }
});

server.route({
	method: 'GET',
	path: '/',
	handler: function (req, res) { res.redirect('/index.html'); }
});

server.route({
	method: 'GET',
	path: '/storage/{param*}',
	handler: { directory: { path: '.', index: false, lookupCompressed: true } }
});

server.route({
	method: 'GET',
	path: '/templates/{param*}',
	handler: { directory: { path: './templates', index: false, lookupCompressed: true } }
});

server.route({
	method: 'GET',
	path: '/{path*}',
	handler: function (req, res) {
		var text = req.params.path;
		res(text);
	}
});

server.route({
	method: 'GET',
	path: '/mac',
	handler: function (req, res) {
		var device = mdb.collection('device');
		device.find({}, {sort: {lastModified: -1}, limit: 3})
			.toArray()
			.then(function (items) {
				res.view('route/mac.html', { items: items });
			});
	}
});

mc.connect(mcp, function(error, db) {
	if (error) throw error;
	console.log(['log', 'mongodb'], 'connected');
	console.log(['log', 'mongodb'], 'authenticated');
	mdb = db;
});