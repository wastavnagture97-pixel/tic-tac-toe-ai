const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetBtn = document.getElementById('reset-btn');

let currentPlayer = "X"; // Player hamesha X rahega
let boardState = ["", "", "", "", "", "", "", "", ""];
let isGameActive = true;

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Player (You) ka click handles
cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const index = cell.getAttribute('data-index');

        // Agar box bhara hai, game khatam hai, ya AI ki turn hai, toh kuch mat karo
        if (boardState[index] !== "" || !isGameActive || currentPlayer !== "X") return;

        makeMove(index, "X");

        if (checkResult("X")) return;

        // Player ki move ke baad, 0.5 second ka delay dekar AI chalega (real feel aane ke liye)
        currentPlayer = "O";
        statusText.innerText = "AI is thinking...";
        setTimeout(aiMove, 500);
    });
});

function makeMove(index, player) {
    boardState[index] = player;
    cells[index].innerText = player;
    // Visual touch: Player X ko alag color aur AI O ko alag color de sakte hain
    cells[index].style.color = player === "X" ? "#00adb5" : "#ff5722";
}

function aiMove() {
    if (!isGameActive) return;

    // 1. Check karo kya AI ('O') is turn me jeet sakta hai?
    let move = findBestMove("O");

    // 2. Agar AI nahi jeet raha, toh check karo kya Player ('X') jeet raha hai? Usko block karo!
    if (move === null) {
        move = findBestMove("X");
    }

    // 3. Agar koi jeet/block nahi ho raha, toh center (4) ya corners check karo
    if (move === null) {
        if (boardState[4] === "") move = 4;
    }

    // 4. Agar center bhi bhara hai, toh koi bhi khali random jagah le lo
    if (move === null) {
        let emptyCells = [];
        boardState.forEach((val, idx) => {
            if (val === "") emptyCells.push(idx);
        });
        move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    // AI ki move execute karo
    if (move !== null) {
        makeMove(move, "O");
        if (checkResult("O")) return;
    }

    currentPlayer = "X";
    statusText.innerText = "Your Turn (Player X)";
}

// AI logic helper: Jo check karega ki kisi player ko jeetne ke liye 1 box baaki hai kya
function findBestMove(player) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];

        // Agar do dabbe same player ke hain aur teesra khali hai
        if (boardState[a] === player && boardState[b] === player && boardState[c] === "") return c;
        if (boardState[a] === player && boardState[c] === player && boardState[b] === "") return b;
        if (boardState[b] === player && boardState[c] === player && boardState[a] === "") return a;
    }
    return null;
}

function checkResult(player) {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (boardState[a] === player && boardState[b] === player && boardState[c] === player) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.innerText = player === "X" ? "You Win! 🎉" : "AI Wins! 🤖";
        isGameActive = false;
        return true;
    }

    if (!boardState.includes("")) {
        statusText.innerText = "It's a Draw! 👔";
        isGameActive = false;
        return true;
    }

    return false;
}

// Restart Game
resetBtn.addEventListener('click', () => {
    currentPlayer = "X";
    boardState = ["", "", "", "", "", "", "", "", ""];
    isGameActive = true;
    statusText.innerText = "Your Turn (Player X)";
    cells.forEach(cell => {
        cell.innerText = "";
        cell.style.color = "white";
    });
});