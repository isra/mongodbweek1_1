var express = require('express');
var assert = require('assert');
var consolidate = require('consolidate');
var nunjucks = require('nunjucks');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');

var app = express();

var pathDb = "mongodb://localhost:27017/m101";

//consolidate.requires.nunjucks = nunjucks.configure();

app.engine('html', consolidate.nunjucks);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var connectDB = function(req, res, next) {

	MongoClient.connect(pathDb, function(err, db){
		assert.equal(null, err);
		console.log("Connected successfully to server");
		req.db = db;
		next();
	});



}




app.get('/', connectDB,  function(req, res, next) {



	req.db.collection('movies').find({}).toArray(function(err, docs){
		assert.equal(err, null);
		res.render('index', { movies: docs, listMenu: 'active' });
		console.log("Found the following records", docs);
		req.db.close();

	});

});

app.get('/new', function(req, res, next) {
	res.render('new', {newMenu: 'active'});
});

app.post('/save', connectDB, function(req, res, next) {

	var name = req.body.name;
	var imdb = req.body.imdb;

	if (name && imdb) {
		var data = {
			name: name,
			imdb: imdb
		}
		console.log(data);
		var result = req.db.collection('movies').insertOne(data, function(err, result) {
			assert.equal(null, err);
			console.log(result);
			req.db.close();
			res.redirect('/');
		});
	}

});

app.use(function(req, res){
	res.sendStatus(404)

});

var server = app.listen(8080, function(){

	var port = server.address().port;

	console.log("Express serve listening on port:", port);

});

