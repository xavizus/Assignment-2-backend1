let dotenv = require("dotenv");
let assert = require("assert");
let fs = require('fs');

// read in the .env file
dotenv.config();

// capture the environment variables the application needs
const {
  SQL_HOST,
  SQL_USERNAME,
  SQL_PASSWORD,
  SQL_DATABASE,
  SQL_DBPORT,
  WEBB_PORT,
  HTTPS_PORT,
  JWTKEY,
  JWTEXPIRYSECONDS,
  USE_SSL,
  SSL_KEY,
  SSL_CERT
} = process.env;

// validate the required configuration information
assert(SQL_HOST, "SQL_HOST is required.");
assert(SQL_USERNAME, "SQL_USERNAME is required.");
assert(SQL_PASSWORD, "SQL_PASSWORD is required.");
assert(SQL_DATABASE, "SQL_DATABASE is required.");
assert(SQL_DBPORT, "SQL_DBPORT is required.");
assert(WEBB_PORT, "WEBB_PORT is required.");
assert(JWTKEY, "JWTKEY is required.");
assert(JWTKEY, "JWTEXPIRYSECONDS is required.");

let sslOptions = {};
if (USE_SSL) {
  sslOptions.key = fs.readFileSync(SSL_KEY);
  sslOptions.cert = fs.readFileSync(SSL_CERT);
}

module.exports = {
  webbPort: WEBB_PORT,
  httpsPort: HTTPS_PORT,
  jwtkey: JWTKEY,
  jwtexpirySeconds: JWTEXPIRYSECONDS,
  useSSL: USE_SSL,
  sslOptions: sslOptions,
  sql: {
    server: SQL_HOST,
    user: SQL_USERNAME,
    password: SQL_PASSWORD,
    database: SQL_DATABASE,
    port: SQL_DBPORT
  },

};