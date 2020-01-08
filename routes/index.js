let express = require('express');
let router = express.Router();
let fetch = require('node-fetch');

/* GET home page. */
router.get('/', async (request, response, next) => {

  let resultObject = await fetch(`${request.config.apiurl}`).then(response => response.json());
  
  response.render('index', {resultObject});
});

module.exports = router;
