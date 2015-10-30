var express = require('express');
var router = express.Router();
var path = require('path');
var threeLtrWords = require('../models/sendThreeWord');
var words = require('../models/words/threeLtr.json');

router.get('/getWords', function(request, response){
    response.jsonp(threeLtrWords);
});

router.get('/', function(request, response){
    response.sendFile(path.join(__dirname, '../server/public/views/pickMonster.html'));
});

router.get('/game', function(request, response){
    response.sendFile(path.join(__dirname, '../server/public/views/pickMonster.html'));
});

module.exports = router;

