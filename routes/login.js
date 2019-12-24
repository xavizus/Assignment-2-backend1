let express = require('express');
let router = express.Router();
let bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get('/', (request,response) => {
    response.render('login');
});

router.post('/',(request,response) => {
    let config = request.config;
    let username = "Stephan";
    const token = jwt.sign({username},config.jwtkey, {
        algorithm: 'HS256',
        expiresIn: Number(config.jwtexpirySeconds)
    });

    console.log('token', token);

    response.cookie('token', token, {maxAge: config.jwtexpirySeconds * 1000, httpOnly: true});
    response.end();
});

module.exports = router;
