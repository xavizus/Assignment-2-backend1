let express = require('express');
let router = express.Router();

router.get('/', (request,response) => {
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
module.exports = router;
