let express = require('express');
// Create router
let router = express.Router();
// Create jsonwebtoken
const jwt = require('jsonwebtoken');

// Use following for checking token.
let checkToken = (request,response,next) => {
    // set default to misstrust client
    request.authenticated = false;
    // Get token from client
    let token = request.cookies['token'];

    // check if token is empty
    if (!token) {
        next();
    }
    // check if token is valid
    jwt.verify(token, request.config.jwtkey, (err, decoded) => {
        // if we got an error
        if (err) {
            next();
        }

        // by this point, the client is authenticated.
        request.authenticated = true;
        // go to next step.
        next();
    });
}

// Root route
router.get('/', (request, response, next) => {
    request.authenticated = true;
    if (request.authenticated) {
        // Get database pool
        let pool = request.db;
        // create response object
        let responseObject = {
            response: request.statusCodes.ok
        };
        // query all restaurants
        pool.query('SELECT restaurantsName,country,city,address,avatar FROM restaurants', (error, results, fields) => {
            // if we got an error
            if (error) {
                // set error code as response
                responseObject.response = request.statusCodes.error;
                // set result to error
                results = error;
            }
            // set results to the responseObject
            responseObject.result = results
            // send responseObject to client.
            response.send(responseObject);
        });
    }
    else {
        response.status(401).send({response: request.statusCodes.error,result: "You are not authorized to use this api."})
    }
});

router.post('/requestToken', (request,response) => {

    // Store expected data in variables from request body.
    let {username,password, serverToken} = request.body;

    // Get database connection
    let pool = request.db;

    // prepare response object.
    let responseObject = {
        response: request.statusCodes.ok
    };

    // if serverToken exists.
    if(serverToken) {
        // Sanitized sql-query
        pool.query('SELECT apiToken_id FROM apiTokens where apiToken = ?',[serverToken] , (error, results, fields) => {
            if (error) {
                // set error code as response
                responseObject.response = request.statusCodes.error;
                // set result to error
                results = error;
            }
            // set results to the responseObject
            responseObject.result = results
            // send responseObject to client.
            return response.status(200).send(responseObject);
        });
    } else {
        returnresponse.status(401).send({status: "Not allowed!"})
    }
});

// Token Refresh route.
router.get('/tokenRefresh', (request, response, next) => {
    
});
module.exports = router;