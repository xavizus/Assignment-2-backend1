let express = require('express');
let router = express.Router();
let fetch = require('node-fetch');

/* GET home page. */
router.get('/', async function(reqest, response, next) {

  let resultObject = await fetch('https://Gamin-dator.xavizus.com/api/v1').then(response => response.json());
  
  response.render('index', {resultObject});
});

module.exports = router;
