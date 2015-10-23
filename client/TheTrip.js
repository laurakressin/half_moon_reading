var app = angular.module("TheTripApp", []);

app.controller("WordController", ['$scope', '$http', function($scope, $http){
    //var for http data array
    $scope.dataArray = [];

    //var for calling this in http call
    var vm = this;

    //array of all letters
    var consonantArray = ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z"];

    var vowelArray = ["a", "e", "i", "o", "u"];

    //array of existing indexes
    remainingWords = [];

    //empty array to store used indexes
    pickedWords = [];

    //random number function to pick random word from function
    randomWord = function(data) {
        var chosenIndex = Math.floor(Math.random() * data.length);
        //console.log("Index chosen", chosenIndex);
        return chosenIndex;
    };

    //random number function to choose which letter won't be appended
    randomLetter = function(chosenWord) {
        var chosenLetterI = Math.floor(Math.random() * chosenWord.length);
        return chosenLetterI;
    };

    //http.get for threeLtr.json
    $http({
        method: 'GET',
        url: '/word/getWords'
    }).then(function successCallback(response) {
        for(var i = 0; i < response.data.length; i++){
            $scope.dataArray.push(response.data[i]);
        }
        vm.word = $scope.dataArray[randomWord($scope.dataArray)].word;
        //console.log("chosen word", vm.word);

        //pulling random letter from word
            chosenIndex = randomLetter(vm.word);
            chosenLtr = vm.word[chosenIndex];
            console.log("chosenLtr", chosenLtr);

        //applying empty string to chosen index of chosen word
            String.prototype.replaceAt=function(index, character) {
                return this.substr(0, index) + character + this.substr(index+character.length);
            };
            vm.word = vm.word.replaceAt(chosenIndex, " ");
            vm.word[chosenIndex] = " ";
            //console.log("modified word", vm.word);

        //choosing multiple answers
            var multiChoiceArray = [];
            multiChoiceArray.push(chosenLtr);

            //no repeat vowels
            if(chosenLtr == "a" || chosenLtr == "e" || chosenLtr == "i" || chosenLtr == "o" || chosenLtr == "u"){
                for(var j = 0; j < 2; j++){
                    var newLtr = vowelArray[randomLetter(vowelArray)];
                    while(newLtr == multiChoiceArray[0] || newLtr == multiChoiceArray[1]){
                        var newLtr = vowelArray[randomLetter(vowelArray)];
                    }
                    multiChoiceArray.push(newLtr);
                    console.log("ran vowel");
                }

            //no repeat consonants
            } else {
                for (var k = 0; k < 2; k++) {
                    var newLtr = consonantArray[randomLetter(consonantArray)];
                    while (newLtr == multiChoiceArray[0] || newLtr == multiChoiceArray[1]) {
                        var newLtr = consonantArray[randomLetter(consonantArray)];
                    }
                    multiChoiceArray.push(newLtr);
                    console.log("ran consonant");
                }
            }
            console.log("multi Choice array", multiChoiceArray);

        //shuffling array
        function shuffle(array) {
            var currentIndex = array.length, temporaryValue, randomIndex ;

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

        vm.shuffledArray = shuffle(multiChoiceArray);
        console.log("shuffled array", multiChoiceArray);

    });


}]);