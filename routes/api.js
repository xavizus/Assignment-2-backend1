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
        let sql = `select r.id, r.address, r.city, r.country, r.avatar, r.restaurantsName as restaurantName,GROUP_CONCAT(g.genreName SEPARATOR ', ') as genre
        FROM restaurants as r
        left join generRestaurant gr on r.id = gr.restaurants_id
        Left JOIN genres g ON g.id = gr.gener_id
        group by r.id`;
        pool.query(sql, (error, results, fields) => {
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

router.get('/emailExist/:emailToCehck', (request,response) => {
    let emailToCehck = request.params.emailToCehck;

    let pool = request.db;

    let responseObject = {
        response: request.statusCodes.ok
    };

    pool.query(`
    SELECT 1
    FROM users 
    WHERE users.email = ?`,
    [emailToCehck],
    (error, results) => {
        if(error) {
            responseObject.response = request.statusCodes.error;
            responseObject.result = error;
            return response.status(200).send(responseObject);
        }

        if(results.length == 0) {
            responseObject.result = {
                exist: false
            };
        } else {
            responseObject.result = {
                exist: true
            };
        }

        return response.status(200).send(responseObject);
    });
});

// Create a new account
router.post('/createNewAccount', (request, response) => {
    let {email, password} = request.body;

    let pool = request.db;

    let responseObject = {
        response: request.statusCodes.ok
    };

    // We don't trust anybody here!

    //Check if it's an email.
    let emailPattern = /\S*[^@]@[a-zA-Z0-9\.]+/i;

    if(!email.match(emailPattern)) {
        responseObject.response = request.statusCodes.error
        responseObject.result = {
            message: "You tampered with the POST-data didn't you? :D"
        }

        response.status(200).send(responseObject);
        return;
    }

});

// Request new token
router.post('/requestToken', (request,response) => {

    // Store expected data in variables from request body.
    let {username,email,password, serverToken} = request.body;

    // Get database connection
    let pool = request.db;

    // prepare response object.
    let responseObject = {
        response: request.statusCodes.ok
    };

    // if serverToken exists.
    if(serverToken) {
        // Sanitized sql-query
        pool.query(`
        SELECT apiToken_id 
        FROM apiTokens 
        WHERE apiToken = ?`,
        [serverToken] , 
        (error, results) => {
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
        return response.status(401).send({status: "Not allowed!"})
    }
});

// Token Refresh route.
router.get('/tokenRefresh', (request, response, next) => {
    let token = request.cookies['token'];
    jwt.verify(token, request.config.jwtkey, (err, decoded) => {
        console.log(decoded);
        // if we got an error
        if (err) {
            request.authenticated = false;
            response.status(401).send({response: request.config.error, result: "Not allowed!"});
            return;
        }

        const token = jwt.sign({username: decoded.username},config.jwtkey, {
            algorithm: 'HS256',
            // expires require data to be number and not string.
            expiresIn: config.jwtexpirySeconds
        });

        // by this point, the client is authenticated.
        request.authenticated = true;
        // go to next step.
        next();
    });
});

// Get top 10 restaurants
router.get('/top10', (request,response) => {

});

module.exports = router;