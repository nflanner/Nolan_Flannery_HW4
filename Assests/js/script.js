var timeEl = document.querySelector("#time");
var totalList = document.querySelector("#selections");
var bigText = document.querySelector("#bigText");
var startText = document.querySelector("#startText");
var startEl = document.querySelector("#start");
var cardEl = document.querySelector("#card");

var currentIndex = 0;
var secondsLeft = 75;
var questionAnswers = {
    'Commonly used data types DO NOT include:': ['strings', 'boolean', 'alerts', 'numbers'],
    'The condition in an if/else statement is encosed within ________.': ['commas', 'quotes', 'curly brackets', 'parenthesis'],
    'Arrays in JavaScript can be used to store:': ['numbers and strings', 'other arrays', 'booleans', 'all of the above'],
    'A very useful tool used during development and debugging for printing content to the debugger is:': ['JavaScript', 'terminal/bash', 'for loops', 'console log']
} 
var answerKey = [2, 3, 3, 3];
var roundWon = false;
var points = 0;
var finished = false;
var highScores = [];

setDefault();

function setTime() {
    // sets interval variable
    var timeInterval = setInterval(function() {
        if (secondsLeft > 0 && finished === false) {
            secondsLeft--;
        }
        timeEl.textContent = 'Time: ' + secondsLeft;

        if (secondsLeft === 0 && finished === false) {
            removeQuestions();
            finishedScreen();
            timeInterval.clearInterval();
        }
    }, 1000);
};

function setDefault() {
    console.log('setting defaults');
    timeEl.textContent = "Time: 0"
    bigText.textContent = 'Coding Quiz';
    startText.textContent = 'Try to answer the following code-related questions within the time limit. Keep in mind that incorrect answers will penalize your score/time by ten seconds!';
    finished = false;
};

function revertDefault() {
    console.log('reverting defaults');
    startText.textContent = "";
    startEl.children[0].remove();
};

function newButtonList(buttonContent, currentIndex) {
    var button = document.createElement("button");
    button.textContent = buttonContent;

    var li = document.createElement("li");
    li.setAttribute("data-index", currentIndex);
    li.appendChild(button);

    totalList.appendChild(li);
}

function setQuestion(currentIndex) {
    bigText.textContent = Object.keys(questionAnswers)[currentIndex];
    var i = 0;
    for (var answerOption of Object.values(questionAnswers)[currentIndex]) {
        newButtonList(answerOption, i);
        i++;
    }
};

function recordRound() {
    var outcome = roundWon ? 'Correct!' : 'Wrong!';
    startEl.textContent = outcome;
    points += roundWon ? 10 : 0;
}

function finishedScreen() {
    bigText.textContent = "All Done!"
    startText.textContent = 'Your final score was ' + points + '.';
    startEl.textContent = "";
    finished = true;
    setHighscoreButton();
}

function removeQuestions() {
    for (var i = 0; i < Object.values(questionAnswers)[currentIndex].length; i++) {
        console.log('removing child: ' + totalList.children[0].textContent);
        totalList.removeChild(totalList.children[0]);
    }
    currentIndex++;
}

function setHighscoreButton() {
    var button = document.createElement("button");
    button.textContent = "Submit";

    var inputText = document.createElement("input");
    inputText.setAttribute("type", "text");

    var li = document.createElement("li");
    li.textContent = "Enter initials: ";
    li.appendChild(inputText);
    li.setAttribute("data-type", "textInput");
    li.appendChild(button);

    totalList.appendChild(li);
}

startButton.addEventListener("click", function(event) {
    event.preventDefault();
    console.log('settings time');
    setTime();
    revertDefault();
    setQuestion(currentIndex);
});

totalList.addEventListener("click", function(event) {
    var element = event.target;
    if (element.matches('button') && element.textContent !== 'Submit') {
        var index = element.parentElement.getAttribute("data-index");
        console.log(index + ':' + answerKey[currentIndex]);
        if (index == answerKey[currentIndex]) {
            roundWon = true;
        } else {
            roundWon = false;
            secondsLeft -= 10;
        }
        recordRound();
        removeQuestions();
        if (currentIndex < answerKey.length) {
            setQuestion(currentIndex);
        } else {
            finishedScreen();
        }
    }

    if (element.textContent === "Submit") {
        // save highscores
        var initials = document.getElementsByTagName("input")[0].value;

        // console.log('I can hear you!');
        // console.log(document.getElementsByTagName("input")[0].value);

        highScores.push({
            initials: initials,
            score: points
        })

        localStorage.setItem("highScores", JSON.stringify(highScores));
        console.log(localStorage);

        // check that theyre stored
        var highScoreCheck = JSON.parse(localStorage.getItem("highScores"));
        console.log('high score check: ' + highScoreCheck);
        for (var score of highScoreCheck) {
            for (key of Object.keys(score)) {
                console.log(key + ': ' + score[key]);
            }
        }
    }
})
