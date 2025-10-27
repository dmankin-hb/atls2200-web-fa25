let newJokeBtn = document.querySelector("#js-new-quote");
let copyBtn = document.querySelector("#js-copy");
let tweetBtn = document.querySelector("#js-tweet");

let currentJoke = "";
let currentJokeId = "";

const endpoint = "https://icanhazdadjoke.com/";

newJokeBtn.addEventListener('click', getJoke);
copyBtn.addEventListener('click', copyToClipboard);
tweetBtn.addEventListener('click', shareOnTwitter);

function getJoke() {
    showLoading();
    
    fetch(endpoint, {
        headers: {
            Accept: "application/json"
        }
    })
        .then(function(response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            currentJoke = data.joke;
            currentJokeId = data.id;
            displayJoke(currentJoke, currentJokeId);
            hideLoading();
        })
        .catch(function(err) {
            console.log(err);
            alert('Failed to get joke!');
            hideLoading();
        });
}

function displayJoke(joke, jokeId) {
    const jokeText = document.querySelector('#js-quote-text');
    const jokeIdDiv = document.querySelector('#js-joke-id');
    jokeText.textContent = joke;
    jokeIdDiv.textContent = "Joke ID: " + jokeId;
}

function showLoading() {
    const loading = document.querySelector('#js-loading');
    const jokeText = document.querySelector('#js-quote-text');
    const jokeIdDiv = document.querySelector('#js-joke-id');
    loading.classList.add('show');
    jokeText.textContent = "";
    jokeIdDiv.textContent = "";
    newJokeBtn.disabled = true;
}

function hideLoading() {
    const loading = document.querySelector('#js-loading');
    loading.classList.remove('show');
    newJokeBtn.disabled = false;
}

function copyToClipboard() {
    if (currentJoke === "") {
        alert('No joke to copy yet!');
        return;
    }
    
    navigator.clipboard.writeText(currentJoke)
        .then(function() {
            alert('Joke copied to clipboard!');
        })
        .catch(function(err) {
            console.log(err);
            alert('Failed to copy joke!');
        });
}

function shareOnTwitter() {
    if (currentJoke === "") {
        alert('No joke to share yet!');
        return;
    }
    
    const tweetText = currentJoke;
    const twitterUrl = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(tweetText);
    window.open(twitterUrl, '_blank');
}

getJoke();