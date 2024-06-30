document.addEventListener('DOMContentLoaded', () => {
    showDialog();
});

function showDialog() {
    const dialog = document.getElementById('dialog');
    dialog.style.display = 'flex';
}

function closeDialog() {
    const dialog = document.getElementById('dialog');
    dialog.style.display = 'none';
}

const grid = document.getElementById('grid');
const messages = document.getElementById('messages');
const gridSize = 5;
let wampusPosition;
let pitPositions = [];
let goldPosition;
let playerPosition;
let gameEnded = false;
let lastMoveDirection;
let hasArrow = true;
let hasGold = false;

function startGame() {
    grid.innerHTML = '';
    messages.innerHTML = '';
    wampusPosition = getRandomPositionExcluding([0]);
    pitPositions = [];
    while (pitPositions.length < 3) {
        const pit = getRandomPositionExcluding([0, wampusPosition]);
        if (!pitPositions.includes(pit)) {
            pitPositions.push(pit);
        }
    }
    goldPosition = getRandomPositionExcluding([0, wampusPosition, ...pitPositions]);
    playerPosition = 0;
    gameEnded = false;
    hasArrow = true;
    hasGold = false;
    lastMoveDirection = null;
    createGrid();
}

function getRandomPositionExcluding(exclusions) {
    let position;
    do {
        position = Math.floor(Math.random() * gridSize * gridSize);
    } while (exclusions.includes(position));
    return position;
}

function createGrid() {
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', () => movePlayer(i));
        grid.appendChild(cell);
    }
    updateGrid();
}

function updateGrid() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const index = parseInt(cell.dataset.index);
        cell.classList.remove('revealed');
        if (index === playerPosition) {
            cell.classList.add('revealed');
            cell.textContent = 'Player';
        } else if (gameEnded || hasGold) {
            if (index === wampusPosition) {
                cell.classList.add('revealed');
                cell.textContent = 'Wampus';
            } else if (pitPositions.includes(index)) {
                cell.classList.add('revealed');
                cell.textContent = 'Pit';
            } else if (index === goldPosition) {
                cell.classList.add('revealed');
                cell.textContent = 'Gold';
            }
        } else {
            cell.textContent = '';
        }
    });
    updateMessages();
}

function updateMessages() {
    if (playerPosition === wampusPosition) {
        messages.textContent = 'ومپوس شما را کشت! بازی تمام شد!';
        gameEnded = true;
        updateGrid();
        endGame();
    } else if (pitPositions.includes(playerPosition)) {
        messages.textContent = 'افتادید داخل گودال! بازی تمام شد!';
        gameEnded = true;
        updateGrid();
        endGame();
    } else if (playerPosition === goldPosition) {
        messages.textContent = 'شما طلا را پیدا کردید! حالا باید به خانه برگردید!';
        hasGold = true;
        updateGrid();
    } else if (playerPosition === 0 && hasGold) {
        messages.textContent = 'شما برنده شدید! طلا را به خانه آوردید!';
        gameEnded = true;
        updateGrid();
        endGame();
    } else {
        let message = 'به جستجو ادامه دهید...';
        if (isNear(wampusPosition)) {
            message = 'بوی بد میاد!';
        } else if (isNear(goldPosition)) {
            message = 'نور می‌بینم!';
        } else if (isNearPit()) {
            message = 'حواستون باشه! نزدیک گودال هستید!';
        }
        messages.textContent = message;
    }
}

function isNear(position) {
    return Math.abs(position - playerPosition) === 1 || Math.abs(position - playerPosition) === gridSize;
}

function isNearPit() {
    return pitPositions.some(pit => isNear(pit));
}

function movePlayer(index) {
    if (gameEnded) return;
    if (Math.abs(index - playerPosition) === 1 || Math.abs(index - playerPosition) === gridSize) {
        lastMoveDirection = index - playerPosition;
        playerPosition = index;
        updateGrid();
    }
}

function shoot() {
    if (!hasArrow || gameEnded) return;
    hasArrow = false;
    let targetPosition = playerPosition;
    while (true) {
        targetPosition += lastMoveDirection;
        if (targetPosition < 0 || targetPosition >= gridSize * gridSize || (lastMoveDirection === 1 && targetPosition % gridSize === 0) || (lastMoveDirection === -1 && targetPosition % gridSize === gridSize - 1)) {
            messages.textContent = 'تیر به دیوار برخورد کرد!';
            break;
        }
        if (targetPosition === wampusPosition) {
            messages.textContent = 'ومپوس را کشتی!';
            wampusPosition = -1; // Remove the wampus
            break;
        }
    }
}

function endGame() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.removeEventListener('click', movePlayer);
    });
    setTimeout(() => alert('برای شروع مجدد، دکمه "شروع بازی" را بزنید'), 100);
}
