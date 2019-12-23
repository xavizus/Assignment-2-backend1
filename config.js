let dotenv = require( "dotenv" );
let assert = require( "assert" );

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
  JWTKEY,
  JWTEXPIRYSECONDS 
} = process.env;

// validate the required configuration information
assert( SQL_HOST, "SQL_HOST is required." );
assert( SQL_USERNAME, "SQL_USERNAME is required." );
assert( SQL_PASSWORD, "SQL_PASSWORD is required." );
assert( SQL_DATABASE, "SQL_DATABASE is required." );
assert( SQL_DBPORT, "SQL_DBPORT is required." );
assert( WEBB_PORT, "WEBB_PORT is required." );
assert( JWTKEY, "JWTKEY is required." );
assert( JWTKEY, "JWTEXPIREYSECONDS is required." );

module.exports = {
    webbPort: WEBB_PORT,
    jwtkey: JWTKEY,
    jwtexpirySeconds: JWTEXPIRYSECONDS,
    sql: {
        server: SQL_HOST,
        user: SQL_USERNAME,
        password: SQL_PASSWORD,
        database: SQL_DATABASE,
        port: SQL_DBPORT
    }
 };