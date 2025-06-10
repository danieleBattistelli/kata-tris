const cells = document.querySelectorAll(".cell");
let currentPlayer = "X";

// Aggiungi un gestore di eventi a ciascuna cella
cells.forEach(cell => {
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
            if (checkWinWithNeighbors(formattedBoard, currentPlayer)) {
                alert(`${currentPlayer} ha vinto!`);
                resetBoard();
                return;
            }

            // Verifica pareggio
            if (Array.from(cells).every(cell => cell.textContent)) {
                alert("Pareggio!");
                resetBoard();
            }

            // Cambia giocatore
            currentPlayer = currentPlayer === "X" ? "O" : "X";
        }
    });
});

// Funzione di reset
function resetBoard() {
    cells.forEach(cell => cell.textContent = "");
    currentPlayer = "X";
}



// Funzione per verificare la vittoria controllando caselle adiacenti
function checkWinWithNeighbors(board, player) {

    // Contatore di occorrenze
    let counts = { rows: [0, 0, 0], cols: [0, 0, 0], diag1: 0, diag2: 0 };

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === player) {
                counts.rows[i]++;
                counts.cols[j]++;
                if (i === j) counts.diag1++;
                if (i + j === 2) counts.diag2++;
            }
        }
    }

    return counts.rows.includes(3) || counts.cols.includes(3) || counts.diag1 === 3 || counts.diag2 === 3;
}
