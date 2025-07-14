const cells = document.querySelectorAll(".cell");
const titleHeader = document.querySelector("#titleHeader");
const xPlayerDisplay = document.querySelector("#xplayerDisplay");
const oPlayerDisplay = document.querySelector("#oPlayerDisplay");
const restartBtn = document.querySelector('.restartBtn');

let player = 'X';
let isPauseGame = false;
let isGameStart = false;

const inputCells = ["", "", "", "", "", "", "", "", ""];

const winConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

// Attach click listeners to each cell
cells.forEach((cell, index) => {
  cell.addEventListener("click", () => tapCell(cell, index));
});

// Handle tap by player
function tapCell(cell, index) {
  if (cell.textContent === '' && !isPauseGame) {
    isGameStart = true;
    updateCell(cell, index);

    if (!checkWinner()) {
      changePlayer();
      randomPick(); // bot turn
    }
  }
}

// Update the selected cell
function updateCell(cell, index) {
  cell.textContent = player;
  inputCells[index] = player;
  cell.style.color = player === 'X' ? "#1892ea" : "#a737ff";
}

// Switch between X and O
function changePlayer() {
  player = player === 'X' ? 'O' : 'X';
  xPlayerDisplay.classList.toggle('active-Player');
  oPlayerDisplay.classList.toggle('active-Player');
}

// AI random pick (with 1 sec delay)
function randomPick() {
  isPauseGame = true;

  setTimeout(() => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * inputCells.length);
    } while (inputCells[randomIndex] !== '');

    updateCell(cells[randomIndex], randomIndex);

    if (!checkWinner()) {
      changePlayer();
      isPauseGame = false;
    }
  }, 1000);
}

// Check if there's a winner or draw
function checkWinner() {
  for (const [a, b, c] of winConditions) {
    if (
      inputCells[a] === player &&
      inputCells[b] === player &&
      inputCells[c] === player
    ) {
      declareWinner([a, b, c]);
      return true;
    }
  }

  if (inputCells.every(cell => cell !== '')) {
    declareDraw();
    return true;
  }

  return false;
}

// Display the winner
function declareWinner(winningIndices) {
  titleHeader.textContent = `${player} Wins!`;
  isPauseGame = true;
  winningIndices.forEach(index => {
    cells[index].style.background = '#2a2343';
  });
  restartBtn.style.visibility = 'visible';
}

// Display draw
function declareDraw() {
  titleHeader.textContent = "Draw!";
  isPauseGame = true;
  restartBtn.style.visibility = 'visible';
}

// Allow player to choose X or O before start
function choosePlayer(selectedPlayer) {
  if (!isGameStart) {
    player = selectedPlayer;

    if (player === 'X') {
      xPlayerDisplay.classList.add('active-Player');
      oPlayerDisplay.classList.remove('active-Player');
    } else {
      xPlayerDisplay.classList.remove('active-Player');
      oPlayerDisplay.classList.add('active-Player');

      // Bot makes the first move if player chose 'O'
      randomPick();
    }
  }
}

// Restart the game
restartBtn.addEventListener('click', () => {
  restartBtn.style.visibility = 'hidden';
  inputCells.fill('');
  cells.forEach(cell => {
    cell.textContent = '';
    cell.style.background = '';
  });
  isPauseGame = false;
  isGameStart = false;
  titleHeader.textContent = 'Choose';
  xPlayerDisplay.classList.add('active-Player');
  oPlayerDisplay.classList.remove('active-Player');
  player = 'X'; // reset default
});
