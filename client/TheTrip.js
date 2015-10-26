var app = angular.module("TheTripApp", []);

app.controller("WordController", ['$scope', '$http', '$timeout', '$interval', function($scope, $http, $timeout, $interval){
    //var for http data array
    $scope.dataArray = [];

    //array of all letters
    var consonantArray = ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z"];
    var vowelArray = ["a", "e", "i", "o", "u"];

    //empty array to store used indexes
    var incorrectWords = [];

    //incorrect answer counter
    var numIncorrect = 0;

    //number of problems answered
    $scope.numAnswered = 0;

    //var for random index
    var randIndex = 0;

    //scopes for monster positions
    var firstPerc = -1;
    var secondPerc = -2;
    var thirdPerc = 1;





    //random number function to pick random word from function
    randomWord = function(data) {
        var selectedIndex = Math.floor(Math.random() * data.length);
        return selectedIndex;
    };

    //random number function to choose which letter won't be appended
    randomLetter = function(chosenWord) {
        var chosenLetterI = Math.floor(Math.random() * chosenWord.length);
        return chosenLetterI;
    };

    //appends new word, pic and answers on page
    var newWord = function(){

        //pulling random letter from word
        if($scope.numAnswered%3 == 0 && incorrectWords.length !== 0 || incorrectWords.length >= 3){
            randIndex = incorrectWords.shift();
        } else {
            randIndex = randomWord($scope.dataArray);
        }

        $scope.word = $scope.dataArray[randIndex].word;
        chosenIndex = randomLetter($scope.word);
        chosenLtr = $scope.word[chosenIndex];

        //applying empty string to chosen index of chosen word
        String.prototype.replaceAt = function (index, character) {
            return this.substr(0, index) + character + this.substr(index + character.length);
        };
        $scope.word = $scope.word.replaceAt(chosenIndex, " ");
        $scope.word[chosenIndex] = " ";

        //choosing multiple answers
        var multiChoiceArray = [];
        multiChoiceArray.push(chosenLtr);

        //no repeat vowels
        if (chosenLtr == "a" || chosenLtr == "e" || chosenLtr == "i" || chosenLtr == "o" || chosenLtr == "u") {
            for (var j = 0; j < 2; j++) {
                var newLtr = vowelArray[randomLetter(vowelArray)];
                while (newLtr == multiChoiceArray[0] || newLtr == multiChoiceArray[1]) {
                    var newLtr = vowelArray[randomLetter(vowelArray)];
                }
                multiChoiceArray.push(newLtr);
            }

            //no repeat consonants
        } else {
            for (var k = 0; k < 2; k++) {
                var newLtr = consonantArray[randomLetter(consonantArray)];
                while (newLtr == multiChoiceArray[0] || newLtr == multiChoiceArray[1]) {
                    var newLtr = consonantArray[randomLetter(consonantArray)];
                }
                multiChoiceArray.push(newLtr);
            }
        }

        //shuffling array function
        function shuffle(array) {
            var currentIndex = array.length, temporaryValue, randomIndex;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        }

        //var for shuffled array
        $scope.shuffledArray = shuffle(multiChoiceArray);
        $scope.shuffledArray = $scope.shuffledArray;
        //console.log("shuffled array", multiChoiceArray);

        //var for word's matching image
        $scope.image = $scope.dataArray[randIndex].img;
    };

    //function to push incorrect
        var pushIncorrect = function(thing) {
            incorrectWords.push(thing)
        };

    //function to count correct
        var countCorrect = function() {
            $scope.numCorrect +=1;
        };

    //function to count incorrect
        var countIncorrect = function() {
            numIncorrect +=1;
        };

    //hides content, asks player to play again or finish
        $scope.isComplete = function(num){
            raceResults($scope.numCorrect, $scope.numAnswered);
            if(num >= 3){
                return true;
            } else {
                return false;
            }
        };

    //shows correct vs. tie
        var raceResults = function(correct, all){
            if(correct + all == all){
                $scope.success = "tied";
            } else {
                $scope.success = "won";
            }
            return $scope.success;
        };

    //moves monsters on click
        var move = function() {
            firstPerc += .2;
            secondPerc += .2;
            thirdPerc += .2;
            $scope.firstLeft = firstPerc + '%';
            $scope.secondLeft = secondPerc + '%';
            $scope.thirdLeft = thirdPerc + '%';
            $scope.stop += 1;
            console.log('stop', $scope.stop);

        };

        $scope.stop = 0;

        var interval = function() {
            $interval(move, 100, 10)
        };

        var moveWinner = function() {
            secondPerc += .2;
            $scope.secondLeft = secondPerc + '%';
        };

        var winner = function() {
            $interval(moveWinner, 100, 10)
        };



    //http.et for threeLtr.json
    $http({
        method: 'GET',
        url: '/word/getWords'
    }).then(function successCallback(response) {
        for (var i = 0; i < response.data.length; i++) {
            $scope.dataArray.push(response.data[i]);
        }
        newWord();



        //click event that allows correct letter to be put in word
            $scope.numCorrect = 0;
            $scope.correctCounter = function(letter) {
                $scope.numAnswered += 1;
                if(letter == chosenLtr){
                    countCorrect();
                    $scope.image = "/images/thumbs-up.svg";
                    winner();
                } else {
                    pushIncorrect(randIndex);
                    countIncorrect();
                }
                $scope.isComplete($scope.numAnswered, $scope.numCorrect);
                $timeout(newWord, 1000);

                //moves monsters on click
                var promise = interval();

            };
        //click to start over
            $scope.again = function(){
                $scope.numAnswered = 0;
                $scope.numCorrect = 0;
                incorrectWords = [];
                firstPerc = -1;
                secondPerc = -2;
                thirdPerc = 1;
                $scope.firstLeft = firstPerc + '%';
                $scope.secondLeft = secondPerc + '%';
                $scope.thirdLeft = thirdPerc + '%';
                newWord();
            };

    });



}]);