let express = require('express');
let router = express.Router();
let fetch = require('node-fetch');

/* GET home page. */
router.get('/', function(req, res, next) {

  fetch('https://Gamin-dator.xavizus.com/api/v1').then(response => response.json()).then(result => console.log(result));
  res.render('index', { title: 'Express' });
});

module.exports = router;
