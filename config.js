let dotenv = require("dotenv");
let assert = require("assert");
let fs = require('fs');
let os = require('os');

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
  SSL_CERT,
  APITOKEN,
  PASSWORD_COMPLEXITY,
  PASSWORD_MINIMUM_LENGTH,
  APIURL
} = process.env;
let sslOptions = {};

// validate the required configuration information
assert(SQL_HOST, "SQL_HOST is required.");
assert(SQL_USERNAME, "SQL_USERNAME is required.");
assert(SQL_PASSWORD, "SQL_PASSWORD is required.");
assert(SQL_DATABASE, "SQL_DATABASE is required.");
assert(SQL_DBPORT, "SQL_DBPORT is required.");
assert(WEBB_PORT, "WEBB_PORT is required.");
assert(JWTKEY, "JWTKEY is required.");
assert(JWTKEY, "JWTEXPIRYSECONDS is required.");
assert(USE_SSL, "USE_SSL is required");
// if USE_SSL is true, then force to require both key and cert
if (USE_SSL.toLowerCase() == "true") {
  assert(SSL_KEY, "SSL_KEY is required.");
  assert(SSL_CERT, "SSL_CERT is required.");
  sslOptions.key = fs.readFileSync(SSL_KEY);
  sslOptions.cert = fs.readFileSync(SSL_CERT);
}
assert(APITOKEN, "APITOKEN is required");
assert(PASSWORD_COMPLEXITY, "PASSWORD_COMPLEXITY is required.");
assert(PASSWORD_MINIMUM_LENGTH, "PASSWORD_MINIMUM_LENGTH is required");
assert(APIURL, "APIURL is required!");

// Prepare passwordComplex
let passwordComplexity;
// Add complexity message
let passwordComplexityMessage = `Your password need to be atleast ${PASSWORD_MINIMUM_LENGTH} characters long. `;

// depending on password complexy, the message and regexp changes.
switch(Number(PASSWORD_COMPLEXITY)) {
  case 3:
    passwordComplexity = /.*(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!"#¤%&/@£$€()=?`|<>{}\\\-_\]\[:;.,\s§½*^¨'+]).*/;
    passwordComplexityMessage += "Your password also need atleast 1 uppercase, 1 lowercase, 1 number and 1 special character.";
    break;
  case 2: 
  passwordComplexity = /.*(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*/;
  passwordComplexityMessage += "Your password also need atleast 1 uppercase, 1 lowercase and 1 number.";
    break;
  case 1:
    passwordComplexity = /.*(?=.*[a-zA-Z])(?=.*[0-9]).*/;
    passwordComplexityMessage += "Your password also need atleast 1 letter and 1 number.";

    break;
  default:
    passwordComplexity = /.*/;
}

module.exports = {
  webbPort: WEBB_PORT,
  httpsPort: HTTPS_PORT,
  jwtkey: JWTKEY,
  jwtexpirySeconds: Number(JWTEXPIRYSECONDS),
  useSSL: USE_SSL.toLowerCase(),
  sslOptions: sslOptions,
  serverAPIToken: APITOKEN,
  apiurl: APIURL,
  sql: {
    server: SQL_HOST,
    user: SQL_USERNAME,
    password: SQL_PASSWORD,
    database: SQL_DATABASE,
    port: SQL_DBPORT
  },
  passwordComplexity: passwordComplexity,
  passwordMinimumLength: Number(PASSWORD_MINIMUM_LENGTH),
  passwordComplexityMessage: passwordComplexityMessage
};