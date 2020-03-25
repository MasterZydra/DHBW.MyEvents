var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
// Add package for openAPI implementation
var expressOpenApi = require('express-openapi');
var apiDoc = require('./api-doc');
var cors = require('cors');

var authenticate = require('./routes/authenticate');
var events = require('./routes/getEvents');
var genres = require('./routes/getGenres');
var accessToken = require('./routes/getSpotifyAccessToken');

var app = express();
app.use(cors());

// Logic to add openAPI path '/api-docs' as endpoint
var paths = [];
expressOpenApi.initialize({
  apiDoc: apiDoc,
  app: app,
  paths: paths
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
app.use('/getEvents', events.router);
app.use('/getSpotifyAccessToken', accessToken.router);

module.exports = app;
