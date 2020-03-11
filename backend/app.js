var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var expressOpenApi = require('express-openapi');
var apiDoc = require('./api-doc');
var path = require('path');

var authenticateRouter = require('./routes/authenticate');
var callbackRouter = require('./routes/callback');
var events = require('./routes/events');

var app = express();

var paths = [
  { path: '/events', module: require('./routes/events') }
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

app.use('/authenticate', authenticateRouter);
app.use('/callback', callbackRouter);
app.use('/events', events.router);

module.exports = app;
