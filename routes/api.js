let express = require('express');
let router = express.Router();
const jwt = require('jsonwebtoken');

router.use((request,response,next) => {
    let token = request.cookies['token'];
    if(!token) return response.status(401).send({auth: false, message: "No token provided."});
    console.log(token);
    jwt.verify(token, request.config.jwtkey, (err,decoded) => {
        if(err) {
            console.log(err);
            return response.status(500).send({auth:false,message: "failed to authenticate token."});
        }
        response.status(200).send(decoded);
    });
});

router.get('/', (request,response,next) => {
    let pool = request.db;
    let data = {
        response: request.statusCodes.ok
    };
    pool.query('SELECT restaurantsName,country,city,address,genres,ratings,avatar FROM restaurants', (error, results, fields) => {
        if (error) {
            data.response = request.statusCodes.error;
            results = error;
        }
        data.result = results
        response.send(data);
    });
});

router.get('/test', (request,response,next) => {

}); 
module.exports = router;
