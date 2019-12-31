let express = require('express');
// Create router
let router = express.Router();
// Create jsonwebtoken
const jwt = require('jsonwebtoken');

// Checks server api token.
let checkApiToken = (request,response,next) => {
    // Get apiServerToken from request
    let apiServerToken = request.params.apiServerToken;
    // Response object
    let responseObject = {
        response: request.statusCodes.error
    }
    // If apiServerToken isn't correct
    if (apiServerToken != request.config.serverAPIToken) {
        // Send unauthorized status and the responseObject
        return response.status(request.statusCodes.http.Unauthorized).send(responseObject);
    }
    next();
}

// Root route
router.get('/', (request, response, next) => {

    // Get database pool
    let pool = request.db;
    // create response object
    let responseObject = {
        response: request.statusCodes.ok
    };
    // query all restaurants
    let sql = `select r.id, r.address, r.city, r.country, r.avatar, r.restaurantsName as restaurantName,GROUP_CONCAT(g.genreName SEPARATOR ', ') as genre
        FROM restaurants as r
        LEFT JOIN generRestaurant gr on r.id = gr.restaurants_id
        LEFT JOIN genres g ON g.id = gr.gener_id
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
                return response.status(request.statusCodes.http.BadRequest).send(responseObject);
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

            return response.status(request.statusCodes.http.Ok).send(responseObject);
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
    if (serverAPIToken != request.config.serverAPIToken) {
        responseObject.result = {
            message: "Wrong serverAPIToken"
        };
        return response.status(request.statusCodes.http.Ok).send({
            responseObject
        });
    }

    pool.query(`
    INSERT INTO users (email,password)
    VALUES (?,?)
    `, [email, password],
        (error, results) => {
            if (error) {
                responseObject.result = error;
                return response.status(request.statusCodes.http.BadRequest).send(responseObject);
            }
            responseObject.response = request.statusCodes.ok;
            return response.status(request.statusCodes.http.Ok).send(responseObject);
        });
});

// Token Refresh route.
router.get('/tokenRefresh', (request, response, next) => {
    let token = request.cookies['token'];
    jwt.verify(token, request.config.jwtkey, (err, decoded) => {
        // if we got an error
        if (err) {
            response.status(request.statusCodes.http.Unauthorized).send({
                response: request.config.error,
                result: "Not allowed!"
            });
            return;
        }
        console.log(decoded);
        let tokenData = decoded.tokenData
        const token = jwt.sign({tokenData}, request.config.jwtkey, {
            algorithm: 'HS256',
            // expires require data to be number and not string.
            expiresIn: request.config.jwtexpirySeconds
        });

        response.cookie('token', token, {maxAge: request.config.jwtexpirySeconds * 1000, httpOnly: true});

        return response.status(request.statusCodes.http.Ok).send({
            response: request.statusCodes.ok
        });
    });
});

router.get('/verifyToken', async (request,response) => {
    let token = request.cookies['token'];

    let responseObject = {
        response: request.statusCodes.error
    }
    if(!token) {
        return response.status(request.statusCodes.http.Unauthorized).send(responseObject);
    }
    let decoded;
    try {
        decoded = await jwt.verify(token, request.config.jwtkey);
    }
    catch(error) {
        responseObject.result = error.message;
        return response.status(request.statusCodes.http.Unauthorized).send(responseObject);
    }

    responseObject.response = request.statusCodes.ok;
    response.status(200).send(responseObject);
});

router.get('/logout', (request,response) => {
    response.cookie('token','', {maxAge: Date.now(0)});
    response.status(request.statusCodes.http.Ok).send({response: request.statusCodes.ok});
});

// Send password requirements.
router.get('/passwordRequirements', (request, response) => {
    let responseObject = {
        passwordComplexity: request.config.passwordComplexity.source,
        passwordMinimumLength: request.config.passwordMinimumLength,
        passwordComplexityMessage: request.config.passwordComplexityMessage
    };

    response.status(request.statusCodes.http.Ok).send(responseObject);
});

// get password hash from email
router.get('/getPasswordHash/:apiServerToken/:email', checkApiToken, (request, response) => {
    // Get email from uri
    let email = request.params.email;
    // get database pool.
    let pool = request.db;

    let responseObject = {
        response: request.statusCodes.error
    }

    // find user email
    pool.query(`
    SELECT password
    FROM users 
    WHERE users.email = ?`,
        [email],
        (error, results) => {
            // if an error occured
            if (error) {
                // store error message
                responseObject.result = error;
                // send client error status and send responseobject
                return response.status(request.statusCodes.http.BadRequest).send(responseObject);
            }
            // if we didn't get any matches
            if (results.length == 0) {
                // respond with false password
                responseObject.result = {
                    password: false
                }
            } else {
                // Change response to OK.
                responseObject.response =  request.statusCodes.ok;
                // Respond the password hash.
                responseObject.result = {
                    password: results[0].password
                };
            }
            // send OK status and the responseObject
            return response.status(request.statusCodes.http.Ok).send(responseObject);
        });
});

router.get('/getUserData/:apiServerToken/:email',checkApiToken, (request, response) => {
    let email = request.params.email;

    // get database pool.
    let pool = request.db;

    let responseObject = {
        response: request.statusCodes.error
    }

    // find user email
    pool.query(`
    SELECT u.id,r.role
    FROM users u
    LEFT JOIN userRole ur ON u.id = ur.user_id
    LEFT JOIN roles r ON r.id = ur.role_id
    WHERE u.email = ?`,
        [email],
        (error, results) => {
            // if an error occured
            if (error) {
                // store error message
                responseObject.result = error;
                // send client error status and send responseobject
                return response.status(request.statusCodes.http.BadRequest).send(responseObject);
            }
            // if we didn't get any matches
            if (results.length == 0) {
                // respond with false password
                responseObject.result = {
                    found: false
                }
            } else {
                // Change response to OK.
                responseObject.response =  request.statusCodes.ok;
                // Respond the password hash.
                responseObject.result = {
                    found: true,
                    id: results[0].id,
                    role: results[0].role
                };
            }
            // send OK status and the responseObject
            return response.status(request.statusCodes.http.Ok).send(responseObject);
        });
});

// Get top 10 restaurants
router.get('/top10', (request, response) => {

});

module.exports = router;