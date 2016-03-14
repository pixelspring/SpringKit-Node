/**
 * Module dependencies.
 */
var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var favicon = require('serve-favicon');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var lusca = require('lusca');
var methodOverride = require('method-override');
var dotenv = require('dotenv');
var MongoStore = require('connect-mongo/es5')(session);
var flash = require('express-flash');
var path = require('path');
var passport = require('passport');
var expressValidator = require('express-validator');
// var sass = require('node-sass-middleware');
var _ = require('lodash');
var nunjucks = require('nunjucks');
var colors = require('colors');

// Console Log Color Theme:
colors.setTheme({
    info: ['bgGreen', 'black'],
    warn: ['bgYellow', 'black'],
    error: ['bgRed', 'black'],
    debug: ['bgBlue', 'black'],
});

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 *
 * Default path: .env
 */
dotenv.load({ path: '.env.example' });

/**
 * API keys and Passport configuration.
 */
var passportConf = require('./config/passport');

/**
 * Create Express server.
 */
var app = express();

/**
 * Connect to MongoDB.
 */
var db = require('./models/db');


/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);

app.set('views', path.join(__dirname, 'views'));

// Use Nunjucks for view engine:
app.set('view engine', 'nunjucks');
var env = nunjucks.configure(app.get('views'), {
    autoescape: true,
    express:    app
});

// Use Compress to GZIP data
app.use(compress());

// Sass Compilation:
/*
app.use(sass({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    debug: true,
    sourceMap: true,
    outputStyle: 'expanded'
}));
*/

app.use(logger('dev'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
        url: process.env.MONGODB || process.env.MONGOLAB_URI,
        autoReconnect: true
    })
}));
app.use(passport.initialize());
app.use(passport.session());

// Flash Messages:
app.use(flash());

// App security:
app.use(lusca({
    csrf: true,
    xframe: 'SAMEORIGIN',
    xssProtection: true
}));

// Middleware to make user var available in all templates:
app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
});

// After successful login, redirect back to /api, /contact or /
app.use(function(req, res, next) {
    if (/(api)|(contact)|(^\/$)/i.test(req.path)) {
      req.session.returnTo = req.path;
    }
    next();
});

// Serve Static Files & cache them with maxAge:
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));


/**
 * Routes.
 */
require('./config/routes')(app, passport)


/**
 * Error Handler.
 */
// app.use(errorHandler());

// 404's
app.use(function(req, res) {
    res.status(400);
    res.render('errors/404.html', {title: '404: File Not Found'});
});
// 500's
app.use(function(error, req, res, next) {
    res.status(500);
    res.render('errors/500.html', {title:'500: Internal Server Error', error: error});
});


/**
 * Start Express server.
 */
app.listen(app.get('port'), function() {
    console.log('Express server started & listening on port %d in %s mode'.info, app.get('port'), app.get('env'));
});

module.exports = app;
