let express = require('express');
let router = express.Router();
let bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// root of login route
router.get('/', (request,response) => {
    response.render('login');
});

// account route
router.get('/newAccount', (request, response) => {

    response.render('newAccount');
})

// root post route
router.post('/',(request,response) => {
    // get config from request
    let config = request.config;
    // Temporary data.
    let username = "Stephan";
    // create a token with jwt
    const token = jwt.sign({username},config.jwtkey, {
        algorithm: 'HS256',
        // expires require data to be number and not string.
        expiresIn: config.jwtexpirySeconds
    });

    // send cookie to client
    response.cookie('token', token, {maxAge: config.jwtexpirySeconds * 1000, httpOnly: true});
    // send response end (because response send isn't used atm).
    response.end();
});

module.exports = router;
