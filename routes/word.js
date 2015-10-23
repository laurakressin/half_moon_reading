var express = require('express');
var router = express.Router();
var path = require('path');
var threeLtrWords = require('../models/sendThreeWord');
var words = require('../models/words/threeLtr.json');

router.get('/getWords', function(request, response){
    console.log("Other", threeLtrWords);
    response.jsonp(threeLtrWords);
    //threeLtrWords.find({}, function(err, words){
    //    if (err) throw err;
    //    console.log("getWords response: ", response);
    //    response.json(words);
    //})
});

module.exports = router;

