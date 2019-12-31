let express = require('express');
// Create router
let router = express.Router();
// Create jsonwebtoken
const jwt = require('jsonwebtoken');

// Use following for checking token.
let checkToken = (request, response, next) => {
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
    } else {
        response.status(401).send({
            response: request.statusCodes.error,
            result: "You are not authorized to use this api."
        })
    }
});

router.get('/emailExist/:emailToCehck', (request, response) => {
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
            if (error) {
                responseObject.response = request.statusCodes.error;
                responseObject.result = error;
                return response.status(200).send(responseObject);
            }

            if (results.length == 0) {
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
    let {
        email,
        password,
        serverAPIToken
    } = request.body;
    let pool = request.db;
    let responseObject = {
        response: request.statusCodes.error
    }
    if(serverAPIToken != request.config.serverAPIToken) {
        responseObject.result = {message: "Wrong serverAPIToken"};
        return response.status(200).send({responseObject});
    }

    pool.query(`
    INSERT INTO users (email,password)
    VALUES (?,?)
    `, [email,password],
    (error, results) => {
        if(error) {
            responseObject.result = error;
            return response.status(200).send(responseObject);
        }
        responseObject.response = request.statusCodes.ok;
        return response.status(200).send(responseObject);
    });
});

// Request new token
router.post('/requestToken', (request, response) => {

    // Store expected data in variables from request body.
    let {
        username,
        email,
        password
    } = request.body;

    // Get database connection
    let pool = request.db;

    // prepare response object.
    let responseObject = {
        response: request.statusCodes.ok
    };

});

// Token Refresh route.
router.get('/tokenRefresh', (request, response, next) => {
    let token = request.cookies['token'];
    jwt.verify(token, request.config.jwtkey, (err, decoded) => {
        console.log(decoded);
        // if we got an error
        if (err) {
            request.authenticated = false;
            response.status(401).send({
                response: request.config.error,
                result: "Not allowed!"
            });
            return;
        }

        const token = jwt.sign({
            username: decoded.username
        }, config.jwtkey, {
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

// Send password requirements.
router.get('/passwordRequirements', (request, response) => {
    let responseObject = {
        passwordComplexity: request.config.passwordComplexity.source,
        passwordMinimumLength: request.config.passwordMinimumLength,
        passwordComplexityMessage: request.config.passwordComplexityMessage
    };

    response.status(200).send(responseObject);
});

// Get top 10 restaurants
router.get('/top10', (request, response) => {

});

module.exports = router;