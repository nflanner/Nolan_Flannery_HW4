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
            timeEl.textContent = 'Time: ' + secondsLeft;
        }

        if (finished === true) {
            clearInterval(timeInterval);
        }

        if (secondsLeft === 0 && finished === false) {
            removeQuestions();
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
    var button = document.createElement("button");
    button.textContent = "Start Quiz";
    startEl.append(button);
    currentIndex = 0;
    points = 0;
};

function revertDefault() {
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
    setSubmitButton();
}

function removeQuestions() {
    for (var i = 0; i < Object.values(questionAnswers)[currentIndex].length; i++) {
        totalList.removeChild(totalList.children[0]);
    }
    currentIndex++;
}

function setSubmitButton() {
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

function setBackClearButtons() {
    var backButton = document.createElement("button");
    backButton.textContent = "Back";
    var clearButton = document.createElement("button");
    clearButton.textContent = "Clear";

    startEl.appendChild(backButton);
    startEl.appendChild(clearButton);
}

function saveScore() {
    var initials = document.getElementsByTagName("input")[0].value;
    highScores.push({
        initials: initials,
        score: points
    })
    localStorage.setItem("highScores", JSON.stringify(highScores));
}

function highScorePage() {
    bigText.textContent = 'High Scores';
    startText.textContent = "";
    totalList.children[0].remove();

    for (var scoreObject of highScores) {
        var scoreString = scoreObject["initials"] + ' - ' + scoreObject["score"];
        var li = document.createElement("li");
        li.textContent = scoreString;
        totalList.appendChild(li);
    }
    setBackClearButtons();
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
        removeQuestions();
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
        clearUL();
    }

    if (element.textContent === 'Start Quiz') {
        finished = false;
        setTime();
        revertDefault();
        setQuestion(currentIndex);
    }
});

