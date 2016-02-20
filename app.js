var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var passport = require('passport');
var request = require('request');
require('./config/passport.js')

var challonge = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var events = require('./routes/events');

var app = express();
//var expressWs = require('express-ws')(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/challonge/tournaments?', function(req, res, next) {
  var apiKey = encodeURIComponent(req.query.apiKey);
  var userName = encodeURIComponent(req.query.userName);
  var challongeUrl = "http://" + userName +":" + userName + "@api.challonge.com/v1/tournaments.json"
  req.pipe(request(challongeUrl)).pipe(res);
});

app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/events', events);

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
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
