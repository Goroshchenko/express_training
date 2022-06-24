var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var lessMiddleware = require('less-middleware');
var logger = require('morgan');
var http = require('http');

var   Admin = require('./controllers/Admin');
var   Home = require('./controllers/Home');
var   Blog = require('./controllers/Blog');
var   Page = require('./controllers/Page');
var session = require('express-session');

var app = express();


var MongoClient = require('mongodb').MongoClient;

var config = require('./config')();

app.set('views', __dirname + '/templates');
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser('fast-delivery-site'));
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(session());


app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.set('view engine', 'hjs');

app.set('views', __dirname + '/templates');
app.set('view engine', 'hjs');

app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;

MongoClient.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port + '/fastdelivery', function(err, db) {
    if(err) {
        console.log('Sorry, there is no mongo db server running.');
    } else {
        var attachDB = function(req, res, next) {
            req.db = db;
            next();
        };
        app.all('/admin*', attachDB, function(req, res, next) {
            Admin.run(req, res, next);
        });
        app.all('/', attachDB, function(req, res, next) {
            Home.run(req, res, next);
        });
        app.all('/blog/:id', attachDB, function(req, res, next) {
            Blog.runArticle(req, res, next);
        });
        app.all('/blog', attachDB, function(req, res, next) {
            Blog.run(req, res, next);
        });
        app.all('/services', attachDB, function(req, res, next) {
            Page.run('services', req, res, next);
        });
        app.all('/careers', attachDB, function(req, res, next) {
            Page.run('careers', req, res, next);
        });
        app.all('/contacts', attachDB, function(req, res, next) {
            Page.run('contacts', req, res, next);
        });
        http.createServer(app).listen(config.port, function(){
            console.log(
                'Successfully connected to mongodb://' + config.mongo.host + ':' + config.mongo.port,
                '\nExpress server listening on port ' + config.port
            );
        });
    }
});
