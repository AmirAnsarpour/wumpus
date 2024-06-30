const grid = document.getElementById('grid');
const messages = document.getElementById('messages');
const gridSize = 5;
let wampusPosition;
let pitPositions = [];
let playerPosition;
let gameEnded = false;

function startGame() {
    grid.innerHTML = '';
    messages.innerHTML = '';
    wampusPosition = Math.floor(Math.random() * gridSize * gridSize);
    pitPositions = [];
    while (pitPositions.length < 3) {
        const pit = Math.floor(Math.random() * gridSize * gridSize);
        if (pit !== wampusPosition && !pitPositions.includes(pit)) {
            pitPositions.push(pit);
        }
    }
    playerPosition = 0;
    gameEnded = false;
    createGrid();
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
        } else if (gameEnded) {
            if (index === wampusPosition) {
                cell.classList.add('revealed');
                cell.textContent = 'Wampus';
            } else if (pitPositions.includes(index)) {
                cell.classList.add('revealed');
                cell.textContent = 'Pit';
            }
        } else {
            cell.textContent = '';
        }
    });
    updateMessages();
}

function updateMessages() {
    if (playerPosition === wampusPosition) {
        messages.textContent = 'شما برنده شدید!';
        gameEnded = true;
        updateGrid();
        endGame();
    } else if (pitPositions.includes(playerPosition)) {
        messages.textContent = 'افتادید داخل گودال! بازی تمام شد!';
        gameEnded = true;
        updateGrid();
        endGame();
    } else {
        if (isNearPit()) {
            messages.textContent = 'حواستون باشه! نزدیک گودال هستید!';
        } else if (isNearWampus()) {
            messages.textContent = 'خیلی نزدیک به پیروزی هستین!';
        } else {
            messages.textContent = 'به جستجو ادامه دهید.';
        }
    }
}

function isNearPit() {
    return pitPositions.some(pit => {
        return Math.abs(pit - playerPosition) === 1 || Math.abs(pit - playerPosition) === gridSize;
    });
}

function isNearWampus() {
    return Math.abs(wampusPosition - playerPosition) === 1 || Math.abs(wampusPosition - playerPosition) === gridSize;
}

function movePlayer(index) {
    if (gameEnded) return;
    if (Math.abs(index - playerPosition) === 1 || Math.abs(index - playerPosition) === gridSize) {
        playerPosition = index;
        updateGrid();
    }
}

function endGame() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.removeEventListener('click', movePlayer);
    });
    setTimeout(() => alert('برای شروع مجدد، دکمه "شروع بازی" را بزنید'), 100);
}
