let express = require('express');
let router = express.Router();
let bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
let fetch = require('node-fetch');

// root of login route
router.get('/', (request,response) => {
    response.render('login');
});

// account route
router.get('/newAccount', (request, response) => {

    response.render('newAccount');
});


// new account post route

router.post('/newAccount',async (request, response) => {
    let {
        email,
        password
    } = request.body;

    let responseObject = {
       response: request.statusCodes.error
    };

    // We don't trust anybody here!

    // Check if it's an email. (minimal check)
    let emailPattern = /\S*[^@]@[a-zA-Z0-9\.]+/i;
    if (!email.match(emailPattern)) {
        responseObject.result = {
            message: "You tampered with the POST-data didn't you? :D"
        }

        response.status(request.statusCodes.http.BadRequest).send(responseObject);
        return;
    }

    // if NOT password length is equal or larger than password minimum length
    // or NOT password matches passwordComplexity
    if (!(password.length >= request.config.passwordMinimumLength ||
            password.match(request.config.passwordComplexity)
        )) {
        responseObject.result = {
            message: "You tampered with the POST-data again didn't you? :D"
        }

        return response.status(request.statusCodes.http.BadRequest).send(responseObject);
    }

    // As said before, We don't trust anybody.
    // We are checking the email through the api.
    let results = await fetch(`${request.config.apiurl}/emailExist/${email}`).then(response => response.json());
    if(results.exist) {
        responseObject.result = {
            message: "You tampered with the POST-data yet once again didn't you? :D"
        }

        return response.status(400).send(responseObject);
    }
    let salt = await bcrypt.genSalt(10);
    let passwordHash = await bcrypt.hash(password,salt);

    
    // From this point, We can asume everything are correct.
    responseObject.response = request.statusCodes.ok;
    let data = {
        serverAPIToken: request.config.serverAPIToken,
        email: email.toLowerCase(),
        password: passwordHash
    }
    results = await fetch(`${request.config.apiurl}/createNewAccount`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json());
    if(results.response != request.statusCodes.ok) {
        responseObject.result = results.result;
        return response.status(request.statusCodes.http.BadRequest).send(responseObject);
    }
    responseObject.response = request.statusCodes.ok;
    return response.status(request.statusCodes.http.Ok).send(responseObject);
});

// login post route
router.post('/login',async (request,response) => {
    // get config from request
    let config = request.config;
    // store email and password in variables.
    let {email, password} = request.body;
    email = email.toLowerCase();
    // responseObject
    let responseObject = {
        response: request.statusCodes.error
    };
    // get passwordhash fpom api.
    let responseData = await fetch(`${request.config.apiurl}/getPasswordHash/${request.config.serverAPIToken}/${email}`)
    .then(response => response.json());
    // store passwordhash
    let passwordHash = responseData.result.password;
    // check if the passwordhash is valid
    if(!passwordHash) {
        // Send badrequest, along with error response.
        return response.status(request.statusCodes.http.BadRequest).send(responseObject);
    }
    // try to compare password to passwordhash.
    let isValidPassword = await bcrypt.compare(password, passwordHash);

    // if it fails to match
    if(!isValidPassword) {
        // Send bad request along with error response.
        return response.status(request.statusCodes.http.BadRequest).send(responseObject);
    }
    
    let userInfo = await fetch(`${request.config.apiurl}/getUserData/${request.config.serverAPIToken}/${email}`)
    .then( response => response.json());
    console.log(userInfo);

    let tokenData = {
        id: userInfo.result.id,
        role: userInfo.result.role,
        email: email
    }
    // create a token with jwt
    const token = jwt.sign(tokenData,config.jwtkey, {
        algorithm: 'HS256',
        // expires require data to be number and not string.
        expiresIn: config.jwtexpirySeconds
    });

    // send cookie to client
    response.cookie('token', token, {maxAge: config.jwtexpirySeconds * 1000, httpOnly: true});
    // send response end (because response send isn't used atm).

    responseObject.response = request.statusCodes.ok;
    response.send(responseObject);
});

module.exports = router;
