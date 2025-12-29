const cardImages = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
let cards = [];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

let moves = 0;
let pairsFound = 0;
const totalPairs = cardImages.length; 

const gameBoard = document.getElementById('game-board');
const movesElement = document.getElementById('moves-count');
const winModal = document.getElementById('win-modal');
const finalMovesElement = document.getElementById('final-moves');

function initGame() {
    gameBoard.innerHTML = '';
    cards = [...cardImages, ...cardImages];
    shuffle(cards);
    
    createCards();
    
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;
    
    moves = 0;
    pairsFound = 0;
    movesElement.innerText = moves;
    winModal.classList.add('hidden');
}

function shuffle(array) {
    array.sort(() => 0.5 - Math.random());
}

function createCards() {
    cards.forEach(symbol => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.symbol = symbol;
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');
    this.innerText = this.dataset.symbol;

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
    } else {
        secondCard = this;
        incrementMoves();
        checkForMatch();
    }
}

function incrementMoves() {
    moves++;
    movesElement.innerText = moves;
}

function checkForMatch() {
    let isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');

    pairsFound++;
    
    if (pairsFound === totalPairs) {
        setTimeout(gameWon, 500);
    }

    resetBoard();
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.innerText = '';
        secondCard.innerText = '';
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function gameWon() {
    finalMovesElement.innerText = moves;
    winModal.classList.remove('hidden');
//saving score
    let score = Math.max(0, 100 - moves);

    if (typeof updateScore === 'function') {
        updateScore('memory', score);
        console.log("Memory score saved:", score);
    } else {
        console.error("userManager.js not found!");
    }
}

initGame();