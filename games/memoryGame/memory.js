const cardImages = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
let cards = [];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

// משתנים למעקב אחרי המשחק
let moves = 0;
let pairsFound = 0;
const totalPairs = cardImages.length; 

// חיבור לאלמנטים ב-HTML
const gameBoard = document.getElementById('game-board');
const movesElement = document.getElementById('moves-count');
const winModal = document.getElementById('win-modal');
const finalMovesElement = document.getElementById('final-moves');

// פונקציה ראשית להתחלת המשחק
function initGame() {
    // 1. ניקוי הלוח והמשתנים
    gameBoard.innerHTML = '';
    cards = [...cardImages, ...cardImages]; // שכפול המערך כדי ליצור זוגות
    shuffle(cards);
    
    // 2. יצירת הקלפים מחדש
    createCards();
    
    // 3. איפוס לוגיקה
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;
    
    // 4. איפוס מונים ותצוגה
    moves = 0;
    pairsFound = 0;
    movesElement.innerText = moves;
    winModal.classList.add('hidden'); // הסתרת חלון הניצחון
}

// ערבוב הקלפים
function shuffle(array) {
    array.sort(() => 0.5 - Math.random());
}

// יצירת הקלפים על המסך
function createCards() {
    cards.forEach(symbol => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.symbol = symbol; // שמירת המידע
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
}

// הפונקציה שקורית בעת לחיצה
function flipCard() {
    if (lockBoard) return; // הלוח נעול (מחשב בודק זוג)
    if (this === firstCard) return; // לחצו על אותו קלף פעמיים

    this.classList.add('flipped');
    this.innerText = this.dataset.symbol; // הצגת האימוג'י

    if (!hasFlippedCard) {
        // קלף ראשון
        hasFlippedCard = true;
        firstCard = this;
    } else {
        // קלף שני
        secondCard = this;
        incrementMoves(); // עדכון מונה הצעדים
        checkForMatch(); // בדיקת התאמה
    }
}

function incrementMoves() {
    moves++;
    movesElement.innerText = moves;
}

function checkForMatch() {
    // האם הסמלים זהים?
    let isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;

    isMatch ? disableCards() : unflipCards();
}

// יש התאמה!
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');

    pairsFound++; // מצאנו עוד זוג
    
    // האם סיימנו את המשחק?
    if (pairsFound === totalPairs) {
        setTimeout(gameWon, 500);
    }

    resetBoard();
}

// אין התאמה - להפוך חזרה
function unflipCards() {
    lockBoard = true; // נועלים את הלוח

    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.innerText = ''; // מחיקת האימוג'י
        secondCard.innerText = '';
        resetBoard();
    }, 1000); // מחכים שנייה אחת
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function gameWon() {
    finalMovesElement.innerText = moves;
    winModal.classList.remove('hidden'); // הצגת חלון הניצחון
}

// הפעלה ראשונית
initGame();