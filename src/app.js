var path = require('path');
var logger = require('morgan');
var feathers = require('feathers');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var assemble = require('./routes/assemble');
var templates = require('./routes/templates');
var template = require('./routes/template');
var forwardCookies = require('./util/cookies').forwardCookies;

var app = feathers();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.configure(feathers.rest())
   .use(logger('dev'))
   .use(bodyParser.json())
   .use(bodyParser.urlencoded({ extended: true }))
   .use(cookieParser())
   .use('/', feathers.static(path.join(__dirname, '..')))
   .use('/api/assemble', assemble)
   .use('/api/template', forwardCookies, template)
   .use('/api/templates', forwardCookies, templates);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
