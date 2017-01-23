let express = require('express');
let path = require('path');
let logger = require('morgan');
let compression = require('compression');
let methodOverride = require('method-override');
let session = require('express-session');
let flash = require('express-flash');
let bodyParser = require('body-parser');
let expressValidator = require('express-validator');
let dotenv = require('dotenv');
let lusca = require('lusca');
let nunjucks = require('nunjucks');
let dateFilter = require('nunjucks-date-filter');
let passport = require('passport');
let chalk = require('chalk');
let moment = require ('moment');

// Console Log Color Themes:
const clrInfo   = chalk.black.bgGreen;
const clrWarn   = chalk.black.bgYellow;
const clrError  = chalk.black.bgRed;
const clrDebug  = chalk.white.bgBlue;
const clrBold   = chalk.bold;
const clrItalic = chalk.italic;

// Load environment variables from .env file
dotenv.load();



// Passport OAuth strategies
require(path.join(__dirname, './config/passport'));

var app = express();

// "Powered By" Middleware:
app.use(function (req, res, next) {
  res.header("X-powered-by", process.env.APP_NAME)
  next()
});


// View engine setup for Nunjucks
var env = nunjucks.configure(app.get('views'), {
    autoescape: true,
    express:    app
});

// Add filter(s):
dateFilter.setDefaultFormat('MMM Do YYYY');
env.addFilter('date', dateFilter);

app.set('view engine', 'njk');

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
require(path.join(__dirname, './config/routes'))(app, passport);

// Error Pages:
// 404's
app.use(function(req, res) {
    res.status(400);
    res.render('errors/404.njk', {title: '404: File Not Found'});
});
// 500's
app.use(function(error, req, res, next) {
    res.status(500);
    res.render('errors/500.njk', {title:'500: Internal Server Error', error: error});
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
  let currentpath = process.cwd();
  let date = new Date();
  let datestring = date.toDateString();
  let timestring = date.toLocaleTimeString();

  console.log(clrBold('\n───────────────────────────────────────────────────────'));
  console.log(clrBold(process.env.APP_NAME) + clrItalic(' started at: ') + clrBold(datestring) + ', ' + clrBold(timestring));
  console.log(clrBold('───────────────────────────────────────────────────────'));
  console.log(clrItalic('→ Port: ') + clrBold(app.get('port')));
  console.log(clrItalic('→ CWD:  ') + clrBold(currentpath));
  console.log(clrItalic('→ Mode: ') + clrBold(app.get('env')));
  console.log(clrBold('───────────────────────────────────────────────────────\n'));
});

module.exports = app;
