var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var expressOpenApi = require('express-openapi');
var apiDoc = require('./api-doc');
var path = require('path');
var cors = require('cors');

var authenticate = require('./routes/authenticate');
var events = require('./routes/events');
var genres = require('./routes/getGenres');
var accessToken = require('./routes/getSpotifyAccessToken');

var app = express();
app.use(cors());

var paths = [
  { path: '/authenticate', module: require('./routes/authenticate')},
  { path: '/events', module: require('./routes/events') },
  { path: '/getGenres', module: require('./routes/getGenres') },
  { path: '/getSpotifyAccessToken', module: require('./routes/getSpotifyAccessToken') },
];

expressOpenApi.initialize({
  apiDoc: apiDoc,
  app: app,
  paths: paths,

  promiseMode: true,
  securityFilter: async (req, res) => {
    res.status(200).json(req.apiDoc);
  }
});

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

app.use('/authenticate', authenticate.router);
app.use('/getGenres', genres.router);
app.use('/events', events.router);
app.use('/getSpotifyAccessToken', accessToken.router);

module.exports = app;
