var express = require('express');
var path = require('path');
var logger = require('morgan');
var compression = require('compression');
var methodOverride = require('method-override');
var session = require('express-session');
var flash = require('express-flash');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var dotenv = require('dotenv');
var lusca = require('lusca');
var nunjucks = require('nunjucks');
var dateFilter = require('nunjucks-date-filter');
var passport = require('passport');
var colors = require('colors');
var moment = require ('moment');

// Console Log Color Theme:
colors.setTheme({
    info: ['bgGreen', 'black'],
    warn: ['bgYellow', 'black'],
    error: ['bgRed', 'black'],
    debug: ['bgBlue', 'white'],
});

// Load environment variables from .env file
dotenv.load();



// Passport OAuth strategies
require('./config/passport');

var app = express();

// "Powered By" Middleware:
app.use(function (req, res, next) {
  res.header("X-powered-by", "Hamsters")
  next()
});


// View engine setup for Nunjucks
var env = nunjucks.configure(app.get('views'), {
    autoescape: true,
    express:    app
});

// Add filter(s):
var dateFilter = require('nunjucks-date-filter');
    dateFilter.setDefaultFormat('MMM Do YYYY');
env.addFilter('date', dateFilter);

app.set('view engine', 'html');

// Set port
app.set('port', process.env.PORT || 3000);

// Use Compress to GZIP data
app.use(compression());

// Logging
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(methodOverride('_method'));

// Session
app.use(session({
  name: process.env.APP_NAME,
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,

  cookie: {
    // secure: true,
    // httpOnly: true,
    // domain: 'example.com',
    // path: 'foo/bar',
    maxAge: 3600000 // 1 hour
  }

}));

// Use Flash messages
app.use(flash());

// Setup Passport Auth
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.locals.user = req.user ? req.user.toJSON() : null;
  next();
});

// Serve Static Files, tell browser to cache for [maxAge]:
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));


/**
 * Routes.
 */
require('./config/routes')(app, passport);

// Error Pages:
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

// App security:
app.use(lusca({
    csrf: true,
    xframe: 'SAMEORIGIN',
    xssProtection: true
}));


// Production error handler
if (app.get('env') === 'production') {
  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.sendStatus(err.status || 500);
  });
}

app.listen(app.get('port'), function() {
    console.log('\n----------------------\nExpress server started\n----------------------\nListening on port %d \nIn %s mode'.debug, app.get('port'), app.get('env'));
});

module.exports = app;
