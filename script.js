const cells = document.querySelectorAll(".cell");
let currentPlayer = "X";

// Aggiungi un gestore di eventi a ciascuna cella
cells.forEach((cell, idx) => {
    cell.addEventListener("click", () => {
        if (cell.textContent === "") {
            cell.textContent = currentPlayer;

            // Creazione della griglia di gioco
            const board = Array.from(cells).map(cell => cell.textContent);
            const formattedBoard = [
                board.slice(0, 3),
                board.slice(3, 6),
                board.slice(6, 9)
            ];

            // Stampa della griglia di gioco e del giocatore attuale
            console.log("Griglia di gioco:", formattedBoard);
            console.log("Cliccata una cella");
            console.log("giocatore attuale: ", currentPlayer);

            // Verifica vittoria
            const winCells = checkWinWithNeighbors(formattedBoard, currentPlayer);
            if (winCells) {
                // Evidenzia le celle vincenti
                winCells.forEach(([row, col]) => {
                    cells[row * 3 + col].classList.add("winner");
                });
                setTimeout(() => {
                    alert(`${currentPlayer} ha vinto!`);
                    resetBoard();
                }, 100);
                return;
            }

            // Verifica pareggio
            if (Array.from(cells).every(cell => cell.textContent)) {
                setTimeout(() => {
                    alert("Pareggio!");
                    resetBoard();
                }, 100);
            }

            // Cambia giocatore
            currentPlayer = currentPlayer === "X" ? "O" : "X";
        }
    });
});

// Funzione di reset
function resetBoard() {
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("winner");
    });
    currentPlayer = "X";
}

// Funzione per verificare la vittoria e restituire le celle vincenti
function checkWinWithNeighbors(board, player) {
    // Combinazioni vincenti: righe, colonne, diagonali
    const winPatterns = [
        // Righe
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        // Colonne
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        // Diagonali
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]]
    ];

    // Restituisce le coordinate delle celle vincenti
    for (const pattern of winPatterns) {
        if (pattern.every(([r, c]) => board[r][c] === player)) {
            return pattern; 
        }
    }
    return null;
}
