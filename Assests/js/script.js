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

setDefault();

function setTime() {
    // sets interval variable
    var timeInterval = setInterval(function() {
        secondsLeft--;
        timeEl.textContent = 'Time: ' + secondsLeft;

        if (secondsLeft === 0) {
            // you lose
        }
    }, 1000);
};

function setDefault() {
    console.log('setting defaults');
    timeEl.textContent = "Time: 0"
    bigText.textContent = 'Coding Quiz';
    startText.textContent = 'Try to answer the following code-related quesstions within the time limit. Keep in mind that incorrect answers will penalize your score/time by ten seconds!';
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
    if (element.matches('button')) {
        var index = element.parentElement.getAttribute("data-index");
        console.log(index + ':' + answerKey[currentIndex]);
        if (index == answerKey[currentIndex]) {
            roundWon = true;
        } else {
            roundWon = false;
            secondsLeft -= 10;
        }
        recordRound();
        currentIndex++;
    }
})
