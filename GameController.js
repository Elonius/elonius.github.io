(function () {
    // constants
    const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const MAX_GUESSES = 6;
    const MIN_WORD_LENGTH = 5;
    const GAME_STATES = {
        GAME_NOT_STARTED: "GAME_NOT_STARTED",
        GAME_IN_PROGRESS: "GAME_IN_PROGRESS",
        GAME_OVER_WIN: "GAME_OVER_WIN",
        GAME_OVER_LOSE: "GAME_OVER_LOSE"
    };
    const OK = "OK";
    // variables
    let gameState = GAME_STATES.GAME_NOT_STARTED;
    let word = null;
    let guess = null;
    let guessesRemaining = null;
    let message = "No word found.";

    let newGame = function (w) {
        if (gameState !== GAME_STATES.GAME_IN_PROGRESS) {
            if (checkWord(w)) {
                word = w.toUpperCase();
                guess = [];
                for (let i = 0; i < word.length; i++) {
                    guess.push("-");
                }
                guessesRemaining = MAX_GUESSES;
                gameState = GAME_STATES.GAME_IN_PROGRESS;
                message = "New game started.";
            } else {
                gameState = GAME_STATES.GAME_NOT_STARTED;
            }

        } else {
            message = "Cannot start new game until current game is complete.";
        }
    };

    let checkWord = function (w) {
        if (w === undefined) {
            message = "Word is undefined.";
            return false;
        }
        if (w === null) {
            message = "Word is null.";
            return false;
        }
        let temp = w.toUpperCase();
        if (temp.length < MIN_WORD_LENGTH) {
            message = "Word is too short.";
            return false;
        }
        for (let i = 0; i < temp.length; i++) {
            if (ALPHABET.indexOf(temp[i]) < 0) {
                message = "Word contains invalid characters.";
                return false;
            }
        }
        return true;
    };

    let processLetter = function (letter) {
        if (letter === undefined) {
            message = "Letter is undefined, not processed.";
            return;
        }

        if (letter === null) {
            message = "Letter is null, not processed.";
            return;
        }

        if (letter.length !== 1) {
            message = "Single letter required, not processed.";
            return;
        }

        if (gameState !== GAME_STATES.GAME_IN_PROGRESS) {
            message = "No game in progress, not processed.";
            return;
        }

        message = "Processed letter '" + letter + "'.";
        if (word.indexOf(letter) >= 0) {
            for (let i = 0; i < word.length; i++) {
                if (word.charAt(i) === letter) {
                    guess[i] = letter;
                }
            }
        } else {
            guessesRemaining--;
        }
        updateGameState();

    };

    let report = function () {
        let guessCopy = guess !== null ? guess.slice() : guess;
        return {
            gameState: gameState,
            word: word,
            guess: guessCopy,
            guessesRemaining: guessesRemaining,
            message: message
        };
    };

    let updateGameState = function () {
        if (guessesRemaining === 0) {
            gameState = GAME_STATES.GAME_OVER_LOSE;
        } else {
            let match = true;
            for (let i = 0; i < word.length; i++) {
                if (word.charAt(i) !== guess[i]) {
                    match = false;
                    break;
                }
            }
            if (match) {
                gameState = GAME_STATES.GAME_OVER_WIN;
            } else {
                gameState = GAME_STATES.GAME_IN_PROGRESS;
            }
        }
    };

    // public methods
    window.GameController = {
        newGame: newGame,
        processLetter: processLetter,
        report: report,
        GAME_STATES: GAME_STATES
    };

})(); // end module
