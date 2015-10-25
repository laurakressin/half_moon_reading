var app = angular.module("TheTripApp", []);

app.controller("WordController", ['$scope', '$http', '$timeout', function($scope, $http, $timeout){
    //var for http data array
    $scope.dataArray = [];

    //array of all letters
    var consonantArray = ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z"];

    var vowelArray = ["a", "e", "i", "o", "u"];

    //array of existing indexes
    var remainingWords = [];

    //empty array to store used indexes
    var incorrectWords = [];

    //incorrect answer counter
    var numIncorrect = 0;

    //number of problems answered
    var numAnswered = 0;

    //var for random index
    var randIndex = 0;

    //random number function to pick random word from function
    randomWord = function(data) {
        var selectedIndex = Math.floor(Math.random() * data.length);
        //console.log("Index chosen", chosenIndex);
        return selectedIndex;
    };

    //random number function to choose which letter won't be appended
    randomLetter = function(chosenWord) {
        var chosenLetterI = Math.floor(Math.random() * chosenWord.length);
        return chosenLetterI;
    };

    //appends new word, pic and answers on page
    var newWord = function(){

        //console.log("chosen word", $scope.word);

        //pulling random letter from word
        if(numAnswered%3 == 0 && incorrectWords.length !== 0 || incorrectWords.length >= 3){
            randIndex = incorrectWords.shift();
            console.log("using incorrect word");
        } else {
            randIndex = randomWord($scope.dataArray);
            console.log("using correct word");
        }

        $scope.word = $scope.dataArray[randIndex].word;
        chosenIndex = randomLetter($scope.word);
        chosenLtr = $scope.word[chosenIndex];

        //console.log("chosenLtr", chosenLtr);

        //applying empty string to chosen index of chosen word
        String.prototype.replaceAt = function (index, character) {
            return this.substr(0, index) + character + this.substr(index + character.length);
        };
        $scope.word = $scope.word.replaceAt(chosenIndex, " ");
        $scope.word[chosenIndex] = " ";
        //console.log("modified word", $scope.word);

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
                //console.log("ran vowel");
            }

            //no repeat consonants
        } else {
            for (var k = 0; k < 2; k++) {
                var newLtr = consonantArray[randomLetter(consonantArray)];
                while (newLtr == multiChoiceArray[0] || newLtr == multiChoiceArray[1]) {
                    var newLtr = consonantArray[randomLetter(consonantArray)];
                }
                multiChoiceArray.push(newLtr);
                //console.log("ran consonant");
            }
        }
        //console.log("multi Choice array", multiChoiceArray);

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
            console.log("Pushed incorrect word");
        };

    //function to count correct
        var countCorrect = function() {
            $scope.numCorrect +=1;
            numAnswered +=1;
            console.log("added one to correct counter");
        };

    //function to count incorrect
        var countIncorrect = function() {
            numIncorrect +=1;
            numAnswered +=1;
            console.log("added one to incorrect counter");
        };

    //http.get for threeLtr.json
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
                if(letter == chosenLtr){
                    countCorrect();
                    console.log("incorrectArray remains = ", incorrectWords);
                    $scope.image = "/images/thumbs-up.svg";
                    console.log("chosenIndex", chosenIndex);
                    $scope.word = $scope.word.replaceAt(chosenIndex, chosenLtr);
                } else {
                    pushIncorrect(randIndex);
                    console.log("Got one wrong = ", incorrectWords);
                    countIncorrect();
                    console.log("Incorrect counter = ", numIncorrect);
                }
                $timeout(newWord, 2000);
            };

        //hides content, asks player to play again or finish
            if (numIncorrect >=15) {

            }
    });


}]);