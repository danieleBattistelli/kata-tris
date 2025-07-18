document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll(".cell");
    console.log("Numero celle trovate:", cells.length); // Debug: deve essere 9
    let currentPlayer = "X";

    // Inserisci il banner nel DOM se non esiste già
    let banner = document.getElementById('game-message-banner');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'game-message-banner';
        document.body.appendChild(banner);
    }

    function showBannerMessage(msg) {
        banner.textContent = msg;
        banner.style.display = 'block';
    }

    function hideBannerMessage() {
        banner.style.display = 'none';
    }

    // Contatore vittorie
    let xWins = 0;
    let oWins = 0;

    // Recupera i punteggi dal localStorage se presenti
    if (localStorage.getItem('xWins')) {
        xWins = parseInt(localStorage.getItem('xWins'), 10);
    }
    if (localStorage.getItem('oWins')) {
        oWins = parseInt(localStorage.getItem('oWins'), 10);
    }

    const xWinsSpan = document.getElementById('x-wins');
    const oWinsSpan = document.getElementById('o-wins');

    // --- BOTTONE RESET ---
    let resetBtn = document.getElementById('reset-counter-btn');
    if (!resetBtn) {
        resetBtn = document.createElement('button');
        resetBtn.id = 'reset-counter-btn';
        resetBtn.textContent = 'Reset';
        // Inserisci il bottone subito dopo il contatore
        oWinsSpan.parentNode.insertBefore(resetBtn, oWinsSpan.nextSibling);
        // Aggiungi un po' di margine
        resetBtn.style.marginLeft = '10px';
        resetBtn.style.marginTop = '10px';
    }

    // Gestore evento per il reset del contatore
    resetBtn.addEventListener('click', () => {
        xWins = 0;
        oWins = 0;
        updateWinCounter();
    });

    function updateWinCounter() {
        xWinsSpan.textContent = `X: ${xWins}`;
        oWinsSpan.textContent = `O: ${oWins}`;
        // Salva i punteggi nel localStorage
        localStorage.setItem('xWins', xWins);
        localStorage.setItem('oWins', oWins);
    }

    // --- SUONO CLICK ---
    const clickSound = new Audio("sounds/click.mp3");

    // --- SUONO VITTORIA ---
    const winSound = new Audio("sounds/win.mp3");

    // --- SUONO PAREGGIO ---
    const drawSound = new Audio("sounds/draw.mp3");

    cells.forEach((cell, idx) => {
        cell.addEventListener("click", () => {
            if (cell.textContent === "") {
                // Riproduci il suono di click
                clickSound.currentTime = 0; // resetta per click rapidi
                clickSound.play().catch(e => {
                    console.warn("Audio non riproducibile:", e);
                });

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
                    // Riproduci il suono di vittoria
                    winSound.currentTime = 0;
                    winSound.play();

                    // Evidenzia le celle vincenti
                    winCells.forEach(([row, col]) => {
                        cells[row * 3 + col].classList.add("winner");
                    });
                    setTimeout(() => {
                        showBannerMessage(`${currentPlayer} ha vinto!`);
                        // Aggiorna il conteggio delle vittorie
                        if (currentPlayer === "X") {
                            xWins++;
                        } else {
                            oWins++;
                        }
                        updateWinCounter();
                        setTimeout(() => {
                            hideBannerMessage();
                            resetBoard();
                        }, 1800);
                    }, 100);
                    return;
                }

                // Verifica pareggio
                if (Array.from(cells).every(cell => cell.textContent)) {
                    // Riproduci il suono di pareggio
                    drawSound.currentTime = 0;
                    drawSound.play();

                    setTimeout(() => {
                        showBannerMessage("Pareggio!");
                        setTimeout(() => {
                            hideBannerMessage();
                            resetBoard();
                        }, 1800);
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
        hideBannerMessage();
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

    // Inizializza il contatore all'avvio
    updateWinCounter();
});
