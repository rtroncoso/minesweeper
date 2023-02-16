const readline = require('readline-sync');

// Constants to define the size of the game board
const ROWS = 8;
const COLS = 8;
const MINES = 2;

// A 2D array to represent the game board
const board = [];

// Keeps track of currently revealed tiles
const fog = [];

// An array to keep track of the positions of mines on the board
const mines = [];

// Initialize the board, state, and place mines randomly
for (let row = 0; row < ROWS; row++) {
  board[row] = [];
  fog[row] = [];
  for (let col = 0; col < COLS; col++) {
    board[row][col] = 0;
    fog[row][col] = '#';
  }
}


for (let i = 0; i < MINES; i++) {
  const row = Math.floor(Math.random() * ROWS);
  const col = Math.floor(Math.random() * COLS);
  if (board[row][col] !== '*') {
    board[row][col] = '*';
    mines.push([row, col]);
  } else {
    i--;
  }
}

// Function to count the number of mines around a cell
function countMines(row, col) {
  let count = 0;
  for (let r = Math.max(0, row - 1); r <= Math.min(row + 1, ROWS - 1); r++) {
    for (let c = Math.max(0, col - 1); c <= Math.min(col + 1, COLS - 1); c++) {
      if (board[r][c] === '*') {
        count++;
      }
    }
  }
  return count;
}

// Populate the board with the number of mines around each cell
for (let i = 0; i < mines.length; i++) {
  let row = mines[i][0];
  let col = mines[i][1];
  for (let r = Math.max(0, row - 1); r <= Math.min(row + 1, ROWS - 1); r++) {
    for (let c = Math.max(0, col - 1); c <= Math.min(col + 1, COLS - 1); c++) {
      if (board[r][c] !== '*') {
        board[r][c]++;
      }
    }
  }
}

// Function to display the game board in the console
function displayBoard() {
  console.log('  ' + [...Array(COLS).keys()].join(' '));
  for (let row = 0; row < ROWS; row++) {
    console.log(row + ' ' + board[row].join(' '));
  }
}

// Function to display the current game state (fog) in the console
function displayFog() {
  console.clear();
  console.log('  ' + [...Array(COLS).keys()].join(' '));
  for (let row = 0; row < ROWS; row++) {
    console.log(row + ' ' + fog[row].join(' '));
  }
}

// Checks if only mines are left unrevealed for win condition
function checkWinCondition() {
  const unrevealed = fog
    .flatMap((value) => [...value])
    .map((tile, index) => {
      const row = index % ROWS;
      const col = Math.floor(index / ROWS);
      return {
        row,
        col,
        tile,
        fogValue: fog[row][col],
        boardValue: board[row][col]
      };
    })
    .filter((tile) => tile.fogValue === '#');

  const hasWon = unrevealed.every(
    (tile) => tile.boardValue === '*'
  );

  if (hasWon) {
    displayFog();
    console.log('You win!!');
    process.exit(0);
  }
}

// Reveals all adjacent cells by using depth first search recursively
function revealAdjacent(row, col) {
  if (row < 0 || col < 0 || row === ROWS || col === COLS) {
    return;
  }

  if (fog[row][col] !== '#' || board[row][col] === '*') {
    return;
  }

  fog[row][col] = board[row][col];
  if (board[row][col] === 0) {
    revealAdjacent(row - 1, col);
    revealAdjacent(row + 1, col);
    revealAdjacent(row, col - 1);
    revealAdjacent(row, col + 1);
  }
}

// Function to be done
function revealCell(row, col) {
  if (fog[row][col] !== '#') {
    console.log('Already revealed');
    return;
  }

  if (board[row][col] === '*') {
    fog[row][col] = board[row][col];
    displayFog();
    console.log('You lost');
    process.exit(0);
  }

  revealAdjacent(row, col);
  checkWinCondition();
  displayFog();
}

// Call the displayBoard function to display the initial state of the board
// displayBoard();
displayFog();

while (true) {
  const position = readline.question('Enter position: (row col) ');
  const [row, col] = position.split(' ').map(n => parseInt(n, 10));

  if (row !== NaN && col !== NaN && row >= 0 && col >= 0 && row < ROWS && col < COLS) {
    revealCell(row, col);
  }
}
