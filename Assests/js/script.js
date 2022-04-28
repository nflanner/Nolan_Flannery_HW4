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

loadScores();
setDefault();

function setTime() {
    // sets interval variable
    var timeInterval = setInterval(function() {
        if (secondsLeft > 0 && finished === false) {
            secondsLeft--;
            timeEl.textContent = 'Time: ' + secondsLeft;
        }
        if (finished === true) {
            clearInterval(timeInterval);
        }
        if (secondsLeft === 0 && finished === false) {
            clearUL();
            finishedScreen();
        }
    }, 1000);
};

function setDefault() {
    secondsLeft = 75;
    timeEl.textContent = "Time: 0"
    bigText.textContent = 'Coding Quiz';
    startText.textContent = 'Try to answer the following code-related questions within the time limit. Keep in mind that incorrect answers will penalize your score/time by ten seconds!';
    clearUL();
    clearStartEl();
    startEl.append(createElement("button", "Start Quiz"));
    currentIndex = 0;
    points = 0;
};

function revertDefault() {
    startText.textContent = "";
    clearStartEl();
};

function newButtonList(buttonContent, currentIndex) {
    var li = document.createElement("li");
    li.setAttribute("data-index", currentIndex);
    li.appendChild(createElement("button", buttonContent));
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
    var li = createElement("li", "Enter initials: ", "data-type", "textInput");
    li.appendChild(createElement("input", "", "type", "text"));
    li.appendChild(createElement("button", "Submit"));
    totalList.appendChild(li);
}

function saveScore() {
    var initials = document.getElementsByTagName("input")[0].value;
    highScores.push({
        initials: initials,
        score: points
    })
    localStorage.setItem("highScores", JSON.stringify(highScores));
}

function loadScores() {
    var localScoreList = JSON.parse(localStorage.getItem("highScores"));
    if (localScoreList != null) {
        for (var obj of localScoreList) {
            highScores.push(obj);
        }
    }
}

function highScorePage() {
    bigText.textContent = 'High Scores';
    startText.textContent = "";
    clearUL();
    for (var scoreObject of highScores) {
        var scoreString = scoreObject["initials"] + ' - ' + scoreObject["score"];
        totalList.appendChild(createElement("li", scoreString));
    }
    startEl.appendChild(createElement("button", "Back"));
    startEl.appendChild(createElement("button", "Clear"));
}

function clearUL() {
    var length = totalList.children.length;
    for (var i = 0; i < length; i++) {
        totalList.children[0].remove();
    }
}

function clearStartEl () {
    var length = startEl.children.length;
    for (var i = 0; i < length; i++) {
        startEl.children[0].remove();
    }
}

function createElement(type, content, attr, attrContent) {
    var element = document.createElement(type);
    element.textContent = content;
    element.setAttribute(attr, attrContent);
    return element;
}

totalList.addEventListener("click", function(event) {
    event.preventDefault();
    var element = event.target;

    if (element.matches('button') && element.textContent !== 'Submit') {
        var index = element.parentElement.getAttribute("data-index");
        if (index == answerKey[currentIndex]) {
            roundWon = true;
        } else {
            roundWon = false;
            secondsLeft -= 10;
        }
        recordRound();
        clearUL();
        currentIndex++;
        if (currentIndex < answerKey.length) {
            setQuestion(currentIndex);
        } else {
            finishedScreen();
        }
    }

    if (element.textContent === "Submit") {
        saveScore();
        highScorePage();
    }
});

startEl.addEventListener("click", function(event){
    event.preventDefault();
    var element = event.target;

    if (element.textContent === 'Back') {
        setDefault();
    }

    if (element.textContent === 'Clear') {
        highScores = [];
        localStorage.setItem("highScores", JSON.stringify(highScores));
        clearUL();
    }

    if (element.textContent === 'Start Quiz') {
        finished = false;
        setTime();
        revertDefault();
        setQuestion(currentIndex);
    }
});

