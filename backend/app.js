var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var cors = require('cors');

var indexRouter = require('./routes');
var usersRouter = require('./routes/users');
var authenticateRouter = require('./routes/authenticate');
var genresRouter = require('./routes/getGenres');
var eventsRoute = require('./routes/events');
var accessTokenRouter = require('./routes/getSpotifyAccessToken');

var app = express();
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/authenticate', authenticateRouter);
app.use('/getGenres', genresRouter);
app.use('/events', eventsRoute);
app.use('/getSpotifyAccessToken', accessTokenRouter);

module.exports = app;
