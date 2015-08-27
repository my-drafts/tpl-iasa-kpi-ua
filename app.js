#!/usr/bin/env node

var hapi = require('hapi');
var inert = require('inert');
var path = require('path');
var static = require( 'node-static' );
var file1 = new static.Server( './templates', { cache: 3600, gzip: true });
var file2 = new static.Server( './public', { cache: 3600, gzip: true });

var server = new hapi.Server({
	app: {
		port: parseInt(process.env.PORT, 10) || 3000,
		langs: ['uk', 'ru', 'en'],
		lang: 'uk',
		template: 'iasa',
		user: 'guest'
	},
	debug: {
		request: ['log']
	},
	load: {
		sampleInterval: 1000
	}
});

server.connection({ port: server.settings.app.port});
server.register(inert, function () {});

server.start(function (err){
	server.log(['log'], 'Server started at: ' + server.info.uri);
});

server.route([
	{ method: 'GET', path: '/', handler: function (req, res) { res('Hello world'); } },
	{ method: 'GET', path: '/test', handler: function (req, res) { res('Test: ok!'); } },
	{
		method: 'GET',
		path: '/static/{param*}',
		handler: function (req, res) {
			res('static', req.param);
		}
	},
	{
		method: 'GET',
		path: '/templates/{path*}',
		config: {
			handler: {
				directory: {
					path: path.join(__dirname, '..', 'templates'),
					index: false,
					redirectToSlash: false
				}
			}
		}
	}
]);

server.on('request', function(){
	console.log(1);
});
