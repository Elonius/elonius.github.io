window.onload = function () {
    loadDataFromFileAndShowInPage("vocabularies.json");
    document.querySelector("#btnNewGame").addEventListener("click", newGame);
    document.querySelector("#countries").addEventListener("click", function () {
        categoryChoices(0)
    });
    document.querySelector("#flowers").addEventListener("click", function () {
        categoryChoices(1)
    });
    document.querySelector("#legal").addEventListener("click", function () {
        categoryChoices(2)
    });
    document.querySelector("#temporal").addEventListener("click", function () {
        categoryChoices(3)
    });
    document.querySelector("#content #letters").addEventListener("click", handleClick);
    document.querySelector("#content").style.display = 'none';
    document.querySelector("#word").style.display = 'none';
    disableButtons(true);
};

function loadDataFromFileAndShowInPage(fileName) {
    var url = fileName; // file name or server-side process name
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            parseJSON(xmlhttp.responseText); // do something when server responds
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function parseJSON(obj) {
    v = JSON.parse(obj);
    t = v.vocabularies;
}

function newGame() {
    document.querySelector("#gallowPic").src = "images/hangman0.png";
    document.querySelector("#theWord").style.display = 'none';
    document.querySelector("#choices").innerHTML = "Please choose a category:";
    togglePicAndStats(false);
    toggleNewGameBtn(false);
    categories('visible'); // Makes category buttons visible
    disableButtons(true, true); // Disables letter buttons and turn button red
}

// Function that gets sent a value(length of array) and returns a random # up to that array length
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function categoryChoices(index) {
    let wordToGuess = document.querySelector("#wordToGuess"),
        // Calls function sending in length of array to return a random # between 0 & length of array
        rand = getRandomInt(t[index].words.length - 1),
        word = t[index].words[rand]; // Uses rand to choose a random word from the array

    togglePicAndStats(true);
    disableButtons(!true); // Enables the letter buttons

    document.querySelector("#theWord").innerHTML = "<br>The word was <u>" + word + "</u>";
    wordToGuess.innerHTML = "";

    // Displays a dash for every letter of randomly chosen word
    for (let i = 0, wordLength = word.length; i < wordLength; i++) {
        if (i !== wordLength - 1)
            wordToGuess.innerHTML += "-,";
        else
            wordToGuess.innerHTML += "-";
    }

    GameController.newGame(word); // Calls function sending random word in
    document.querySelector("#hangman").style.visibility = 'visible'; // Makes the gallow img visible
    document.querySelector("#guessesRemaining").innerHTML = "Guesses remaining: " + GameController.report().guessesRemaining;
    document.querySelector("#category").innerHTML = '<br>Category: ' + t[index].categoryName;
    categories('hidden'); // Calls function to hide the category buttons
}

function togglePicAndStats(bool) {
    let hangman = document.querySelector("#hangman"),
        word = document.querySelector("#word"),
        content = document.querySelector("#content"),
        guessesRemaining = document.querySelector("#guessesRemaining"),
        category = document.querySelector("#category");

    if (bool) {
        hangman.classList.add('hangmanLeft');
        word.classList.add('wordRight');
        word.style.display = 'block';
        content.style.display = 'block';
        guessesRemaining.style.display = 'block';
        category.style.display = 'block';
    } else {
        hangman.classList.remove('hangmanLeft');
        word.classList.remove('wordRight');
        word.style.display = 'none';
        content.style.display = 'none';
        guessesRemaining.style.display = 'none';
        category.style.display = 'none';
    }
}

function categories(value) { // Hides/shows category buttons
    let categories = document.querySelectorAll("#choiceCategories *")
    categories.forEach(element => {
        element.style.visibility = value;
    });
}

function disableButtons(value, bool) { // Disables letter buttons
    let btn = document.querySelectorAll("#letters button")
    btn.forEach(element => {
        element.disabled = value;
        if (bool) {
            element.classList.remove('redWhite');
        }
    });
}

function handleClick(e) {
    let button = e.target,
        letter = e.target.value.toUpperCase(),
        guesses = document.querySelector("#guessesRemaining"),
        wordToGuess = document.querySelector("#wordToGuess");
    button.disabled = true; // Disables clicked on button
    button.classList.add('redWhite'); // Adds the class to turn buttons red
    GameController.processLetter(letter);
    GameController.report();
    changePictures();
    guesses.innerHTML = "Guesses remaining: " + GameController.report().guessesRemaining; //  + '<br>Category: ' + t[0].categoryName
    wordToGuess.innerHTML = GameController.report().guess;

    if (GameController.report().gameState === "GAME_OVER_WIN") // Make into its own function?
    {
        alert("\t\tYou won!\n\nClick 'New Game' to play again.");
        disableButtons(true);
        toggleNewGameBtn(true);
    }
    // console.log("TCL: handleClick -> GameController.report()", GameController.report())
}

function changePictures() {
    let guess = GameController.report().guessesRemaining;
    let gallow = document.querySelector("#gallowPic")

    switch (guess) {
        case 5:
            gallow.src = "images/hangman1.png";
            break;
        case 4:
            gallow.src = "images/hangman2.png";
            break;
        case 3:
            gallow.src = "images/hangman3.png";
            break;
        case 2:
            gallow.src = "images/hangman4.png";
            break;
        case 1:
            gallow.src = "images/hangman5.png";
            break;
        case 0:
            gallow.src = "images/hangman6.png";
            alert("\t\tYou lost!\n\nClick 'New Game' to play again.");
            toggleNewGameBtn(true);
            document.querySelector("#theWord").style.display = 'block';
            disableButtons(true);
            break;
        default:
            gallow.src = "images/hangman0.png";
            break;
    }
}

function toggleNewGameBtn(bool) {
    let newGame = document.querySelector("#btnNewGame");
    if (bool)
        newGame.removeAttribute('disabled');
    else
        newGame.disabled = true;
}