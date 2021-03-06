var express = require('express');
var app = express();
var getWords = require('./routes/word');
var mongoose = require('mongoose');

var mongoURI = "mongodb://localhost:27017/TheTripApp";

var mongoDB = mongoose.connect(mongoURI).connection;

mongoDB.once('open', function(){
    console.log('Connected to MongoDB!');
});

app.use(express.static(__dirname + '/server/public'));
app.use('/word', getWords);

app.get('/', function(request, response){
    response.sendFile(__dirname +'/server/public/views/index.html')
});

app.get('/game', function(request, response){
    response.sendFile(__dirname + '/server/public/views/game.html')
});

app.use(function(request, response, next){
    var err = new Error ('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    if(err.status !== 404) {
        return next();
    }

    res.send(err.message || '** no unicorns here **');
});

var server = app.listen(3000, function(){
    var port = server.address().port;
    console.log('Listening on port; ', port);
});

module.exports = app;