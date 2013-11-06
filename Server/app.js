var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var io = require('socket.io');

var database = require('./database');
var config = require('./config.json');

var sockets = {};
function broadcaseFn() {
	database.getTotals(function(totals) {
		if (totals) {
			for(socketId in sockets) {
				var socket = sockets[socketId];
				socket.emit('totals',totals);
			}
		}
	});
}

var app = express();

app.configure(function () {
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.errorHandler());
});

app.put('/log', function(req,res) {
	var success = database.logEvent(req.body.data);
	if (success) {
		res.send(200);
	} else {
		res.send(500);
	}
	broadcaseFn();
});

app.get('/totals', function(req,res) {
	database.getTotals(function(totals) {
		if (totals) {
			res.setHeader('Content-type','application/json');
			res.send(totals);
		} else {
			res.send(500);
		}
	})
})

database.connect(function() {
	var server = http.createServer(app).listen(config.express.port, function(){
		console.log('Express server listening');
	});

	var sio = io.listen(server);
	sio.sockets.on('connection', function(client) {
		sockets[client.id] = client;

		client.on('disconnect', function() {
			delete sockets[client.id];
		});
	});
});