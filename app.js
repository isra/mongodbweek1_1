var express = require('express');
var assert = require('assert');
var consolidate = require('consolidate');
var nunjucks = require('nunjucks');
var MongoClient = require('mongodb').MongoClient;

var app = express();

var pathDb = "mongodb://localhost:27017/m101";

//consolidate.requires.nunjucks = nunjucks.configure();

app.engine('html', consolidate.nunjucks);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');

MongoClient.connect(pathDb, function(err, db){

	assert.equal(null, err);
	console.log("Connected successfully to server");


	app.get('/', function(req, res, next){

		db.collection('movies').find({}).toArray(function(err, docs){
			assert.equal(err, null);
			res.render('index', { movies: docs });
			console.log("Found the following records", docs);
			db.close();

		});

	});

	app.use(function(req, res){
		res.sendStatus(404)

	});

	var server = app.listen(8080, function(){

		var port = server.address().port;

		console.log("Express serve listening on port:", port);

	});

});