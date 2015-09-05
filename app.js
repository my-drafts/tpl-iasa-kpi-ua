#!/usr/bin/env node

var hapi = require('hapi');
var swig = require('swig');
var handlebars = require('handlebars');
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
		engines: {
			html: new swig.Swig({
				cache: false,
				locals: { meta: {} },
				loader: swig.loaders.fs(server.settings.app.storage)
			}),
			shtml: handlebars
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

// route: test
server.route({
	method: 'GET',
	path: '/test/{path*}',
	handler: function (req, res) {
		var text = 'Test: ok!\n';
		text += 'path: ' + JSON.stringify(req.params.path) + '\n';
		text += 'query: ' + JSON.stringify(req.query) + '\n';
		res(text).type('text/plain');
	},
	config: {
		pre: [
			{
				method: require('./lib/preRoute').langCheck,
				assign: 'langCheck'
			}
		]
	}
});

// route: static storage
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

// route: front page
server.route({
	method: 'GET',
	path: '/',
	handler: function (req, res) { res.redirect('/index.html'); }
});

// route: unknown
server.route({
	method: 'GET',
	path: '/{path*}',
	handler: function (req, res) {
		var text = req.params.path;
		res(text);
	}
});

// route: macs
server.route({
	method: 'GET',
	path: '/mac-ru.html',
	handler: function (req, res) {
		var device = mdb.collection('device');
		device.find({}, {sort: {lastModified: -1}, limit: 500})
			.toArray()
			.then(function (items) {
				res.view('templates/default/route/mac-ru.html', { items: items });
			});
	}
});

mc.connect(mcp, function(error, db) {
	if (error) throw error;
	console.log(['log', 'mongodb'], 'connected');
	console.log(['log', 'mongodb'], 'authenticated');
	mdb = db;
});