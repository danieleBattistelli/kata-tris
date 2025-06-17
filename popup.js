const trisRoot = document.getElementById('tris-root');
const resetBtn = document.getElementById('reset-btn');
const statusDiv = document.getElementById('status');

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameOver = false;

// Precarica l'audio del click
const clickAudio = new Audio(chrome.runtime.getURL('click.mp3'));
// Precarica l'audio del pareggio
const drawAudio = new Audio(chrome.runtime.getURL('draw.mp3'));
// Precarica l'audio della vittoria
const winAudio = new Audio(chrome.runtime.getURL('win.mp3'));

function renderBoard() {
    trisRoot.innerHTML = '';
    board.forEach((cell, idx) => {
        const cellDiv = document.createElement('div');
        cellDiv.className = 'tris-cell';
        cellDiv.textContent = cell ? cell : '';
        cellDiv.addEventListener('click', () => handleMove(idx));
        trisRoot.appendChild(cellDiv);
    });
    updateStatus();
}

function updateStatus() {
    if (gameOver) {
        if (checkWinner()) {
            statusDiv.textContent = `Vince ${currentPlayer}!`;
        } else {
            statusDiv.textContent = 'Pareggio!';
        }
    } else {
        statusDiv.textContent = `Turno: ${currentPlayer}`;
    }
}

function handleMove(idx) {
    if (board[idx] || gameOver) return;
    // Riproduci il suono del click
    clickAudio.currentTime = 0;
    clickAudio.play();
    board[idx] = currentPlayer;
    if (checkWinner()) {
        // Riproduci il suono della vittoria
        winAudio.currentTime = 0;
        winAudio.play();
        setTimeout(() => alert(`Vince ${currentPlayer}!`), 10);
        gameOver = true;
    } else if (board.every(cell => cell)) {
        // Riproduci il suono del pareggio
        drawAudio.currentTime = 0;
        drawAudio.play();
        setTimeout(() => alert('Pareggio!'), 10);
        gameOver = true;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
    renderBoard();
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return winPatterns.some(pattern =>
        pattern.every(idx => board[idx] === currentPlayer)
    );
}

resetBtn.addEventListener('click', () => {
    board = Array(9).fill(null);
    currentPlayer = 'X';
    gameOver = false;
    renderBoard();
});

renderBoard();
