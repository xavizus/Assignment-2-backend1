let express = require('express');
let router = express.Router();
let fetch = require('node-fetch');
const jwt = require('jsonwebtoken');

// Make sure we always have an admin to do with, no matter which route we are at after /admin.
router.use(async (request,response,next) => {
    let token = request.cookies['token'];

    if(!token) {
        return response.status(request.statusCodes.http.Unauthorized).redirect('/');
    }
    let decoded;
    try {
        decoded = await jwt.verify(token, request.config.jwtkey);
    }
    catch(error) {
        return response.status(request.statusCodes.http.Unauthorized).redirect('/');
    }

    if(decoded.role != 'admin') {
        return response.status(request.statusCodes.http.Unauthorized).redirect('/');
    }
    next();
});


router.get('/', async function(request, response, next) {
    let resultObject = await fetch(`${request.config.apiurl}`).then(response => response.json());
    resultObject.isAdmin = true;
    
    response.render('admin', {resultObject});
  });

module.exports = router;
