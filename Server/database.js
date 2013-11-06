var config = require('./config.json');
var mongodb = require('mongodb');

var db = null;
var logCollection;

exports.connect = function(callback) {
	mongodb.MongoClient.connect("mongodb://"+config.db.host+":"+config.db.port+"/"+config.db.name, function(err, _db) {
		if(err == null) {
			db = _db;
			db.collection('log', function(err, collection) {
				if (err) {
					console.log(err);
				} else {
					logCollection = collection;
					callback();
				}
			});
		} else {
			console.log(err);
		}
	});
}

exports.logEvent = function(event) {
	logCollection.insert({
		type: event,
		stamp: new Date().getTime()
	}, {w:1}, function(err, result) {});
	return true;
}

exports.getTotals = function(callback) {
	logCollection.count({
		type: 'left'
	},{},function(err,lcount) {
		if (err) {
			callback(null);
		} else {
			logCollection.count({
				type: 'right'
			},{},function(err,rcount) {
				if (err) {
					callback(null);
				} else {
					callback({
						right: rcount,
						left: lcount
					});
				}
			});
		}
	});
}