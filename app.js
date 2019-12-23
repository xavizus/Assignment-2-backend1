let http = require('http');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let fetch = require("node-fetch");
let mysql = require('mysql');

// Load configurations needed to run.
const config = require("./config");

const statusCodes = require("./statusCodes");

// Create DB connection pool
let db = mysql.createPool ({
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
let loginRouter = require('./routes/login');

let app = express();

// config settings
app.use((request,response, next) => {
  request.statusCodes = statusCodes;
  request.db = db;
  request.config = config;
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Root router
app.use('/', indexRouter);
// Api router
app.use('/api/v1', apiRouter);
//login router
app.use('/login', loginRouter);


let server = http.createServer(app).listen(config.webbPort);
