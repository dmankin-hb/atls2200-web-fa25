let triviaBtn = document.querySelector("#js-new-quote");
let answerBtn = document.querySelector("#js-tweet");

let currentQuestion = "";
let currentAnswer = "";

const endpoint = "https://trivia.cyberwisp.com/getrandomchristmasquestion";

triviaBtn.addEventListener('click', getQuote);
answerBtn.addEventListener('click', showAnswer);

function getQuote() {
    console.log("Button clicked");
    
    fetch(endpoint)
        .then(function(response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(function(json) {
            console.log(json);
            currentQuestion = json["question"];
            currentAnswer = json["answer"];
            displayQuote(currentQuestion);
            document.querySelector("#js-answer-text").textContent = "";
        })
        .catch(function(err) {
            console.log(err);
            alert('Failed to get new trivia!');
        });
}

function displayQuote(question) {
    const questionText = document.querySelector('#js-quote-text');
    questionText.textContent = question;
}

function showAnswer() {
    const answerText = document.querySelector('#js-answer-text');
    answerText.textContent = currentAnswer;
}

getQuote();