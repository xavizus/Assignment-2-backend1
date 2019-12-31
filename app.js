let http = require('http');
let https = require('https');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let mysql = require('mysql');
let bodyParser = require('body-parser')

// Load configurations needed to run.
const config = require("./config");

const statusCodes = require("./statusCodes");

// Create DB connection pool
let db = mysql.createPool({
  connectionLimit: 10, // Maximum connections
  acquireTimeout: 5000, // timeout for quetime 
  connectTimeout: 10000, // timeout for database connection.
  host: config.sql.server,
  user: config.sql.user,
  password: config.sql.password,
  database: config.sql.database,
  port: config.sql.port
});

// Routers
let indexRouter = require('./routes/index');
let apiRouter = require('./routes/api');
let accountRouter = require('./routes/account');

// Express middleware
let app = express();

// config settings
app.use((request, response, next) => {
  request.statusCodes = statusCodes;
  request.db = db;
  request.config = config;
  next();
});

// Body parser (Mostly for post-requests)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Root router
app.use('/', indexRouter);
// Api router
app.use('/api/v1', apiRouter);
//account router
app.use('/account', accountRouter);

// Check if ssl will be used or not.
if (config.useSSL) {

  //Create webbserver which listen at https traffic and uses a express app.
  https.createServer(config.sslOptions, app).listen(config.httpsPort);

  // simple http server, to redirect all http traffic to https.
  http.createServer((request, response) => {
    response.writeHead(301, {
      'Location': `https://${request.headers.host + request.url}`
    });
    response.end();
  }).listen(config.webbPort);
}
// If ssl is not in use.
else {
  // create a http server that uses express middleware.
  http.createServer(app).listen(config.webbPort);
}