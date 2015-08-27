console.log('-1.1-');

var http = require('http');
var fs = require('fs');
var path = require('path');
var server = http.createServer().listen(3000);
var stream = require('stream');

server.on('connection', function (socket) {
	console.log('connection!');
});

server.on('close', function () {
	console.log('close!');
});

server.on('request', function (request, response) {
	console.log(request.url);
	console.log('request1!');
	var p = '/templates/default/ico/favicon.ico'
	if (request.url === p){
		p = __dirname + '/../..' + p;
		p = path.resolve(p);
		console.log('stream!: ' + p);
		var stat = fs.statSync(p);
		console.log(stat);
		response.writeHead(200, {
			'Content-Type': 'image/x-icon',
			'Content-Length': stat.size
		});
		var rs = fs.createReadStream(p);
		//rs.on('data', function(data) { response.write(data); });
		//rs.on('end', function() { response.end(); });
		rs.pipe(response);
	}
});
/*
server.on('request', function (request, response) {
	console.log('request2!');
	response.end();
});
*/
server.on('connect', function (request, socket, head) {
	console.log('connect!');
});

server.on('checkContinue', function (request, response) {
	console.log('checkContinue!');
	response.end();
});

server.on('upgrade', function (request, socket, head) {
	console.log('upgrade!');
});

server.on('clientError', function (exception, socket) {
	console.log('clientError!');
});

console.log('-1.9-');
