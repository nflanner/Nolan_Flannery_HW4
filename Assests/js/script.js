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

// upon loading the url, load locally-saved high scores and set the default starting page
loadScores();
setDefault();

function setTime() {
    // sets interval variable
    var timeInterval = setInterval(function() {
        if (secondsLeft > 0 && finished === false) {
            secondsLeft--;
            timeEl.textContent = 'Time: ' + secondsLeft;
        }
        // clear the interval if the quiz is finished
        if (finished === true) {
            clearInterval(timeInterval);
        }
        // end the quiz if the timer reaches zero but the user hasn't finished
        if (secondsLeft === 0 && finished === false) {
            clearUL();
            finishedScreen();
        }
    }, 1000);
};

// this sets the initial screen when first loading in to the quiz
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

// this reverts the default screen
function revertDefault() {
    startText.textContent = "";
    clearStartEl();
};

// helper function for creating list elemtns that contain buttons for the answer options
function newButtonList(buttonContent, currentIndex) {
    var li = document.createElement("li");
    li.setAttribute("data-index", currentIndex);
    li.appendChild(createElement("button", buttonContent));
    totalList.appendChild(li);
}

// this function sets all the questions and answers
function setQuestion(currentIndex) {
    bigText.textContent = Object.keys(questionAnswers)[currentIndex];
    var i = 0;
    for (var answerOption of Object.values(questionAnswers)[currentIndex]) {
        newButtonList(answerOption, i);
        i++;
    }
};

// records the outcome of each round,tells the user if the answer was wrong or right, and records the points
function recordRound() {
    var outcome = roundWon ? 'Correct!' : 'Wrong!';
    startEl.textContent = outcome;
    points += roundWon ? 10 : 0;
}

// helper function that sets the screen directly after finishing the quiz
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

// this saves the initals and score to local storage
function saveScore() {
    var initials = document.getElementsByTagName("input")[0].value;
    highScores.push({
        initials: initials,
        score: points
    })
    localStorage.setItem("highScores", JSON.stringify(highScores));
}

// loads the locally sctored scores so that refreshing the page doesn't lose any data
function loadScores() {
    var localScoreList = JSON.parse(localStorage.getItem("highScores"));
    if (localScoreList != null) {
        for (var obj of localScoreList) {
            highScores.push(obj);
        }
    }
}

// helper function that sets the high score page
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

// this fully clears the unordered list element
function clearUL() {
    var length = totalList.children.length;
    for (var i = 0; i < length; i++) {
        totalList.children[0].remove();
    }
}

// this fully clears the start div element
function clearStartEl () {
    var length = startEl.children.length;
    for (var i = 0; i < length; i++) {
        startEl.children[0].remove();
    }
}

// helper function that creates any given element and sets text content/attribute
function createElement(type, content, attr, attrContent) {
    var element = document.createElement(type);
    element.textContent = content;
    element.setAttribute(attr, attrContent);
    return element;
}

// this event listener is for the ul element 
totalList.addEventListener("click", function(event) {
    event.preventDefault();
    var element = event.target;

    // if the button is selected and the text content of that button is not 'Submit' then the user selected an answer
    if (element.matches('button') && element.textContent !== 'Submit') {
        var index = element.parentElement.getAttribute("data-index");
        // validate that the index associated with the selected answer is the same as the index of the correct answer
        if (index == answerKey[currentIndex]) {
            roundWon = true;
        } else {
            roundWon = false;
            secondsLeft -= 10;
        }
        // the question answered is now complete - record the points then clear the answers
        recordRound();
        clearUL();
        currentIndex++;
        // make sure all questions have or have not been answered, then set a new question or go to the finish screen
        if (currentIndex < answerKey.length) {
            setQuestion(currentIndex);
        } else {
            finishedScreen();
        }
    }

    // if the user submits there score then save the score locally and then activate the high score page
    if (element.textContent === "Submit") {
        saveScore();
        highScorePage();
    }
});

// this event listener looks for 'Back', 'Clear', and 'Start Quiz' button selections
startEl.addEventListener("click", function(event){
    event.preventDefault();
    var element = event.target;

    // returns to start page
    if (element.textContent === 'Back') {
        setDefault();
    }

    // clears the locally-stored high scores
    if (element.textContent === 'Clear') {
        highScores = [];
        localStorage.setItem("highScores", JSON.stringify(highScores));
        clearUL();
    }

    // starts the quiz again
    if (element.textContent === 'Start Quiz') {
        finished = false;
        setTime();
        revertDefault();
        setQuestion(currentIndex);
    }
});

