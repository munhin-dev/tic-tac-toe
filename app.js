const buttons = document.querySelectorAll(".game-board button");
const resetBtn = document.querySelector(".reset-btn");
const gameInfo = document.querySelector(".game-info");
const overlay = document.querySelector(".overlay");
const scorePlayer1 = document.querySelector(".player-1");
const scorePlayer2 = document.querySelector(".player-2");
const scoreTie = document.querySelector(".tie");
let scoreCount = { player1: 0, player2: 0, tie: 0 };
let isPlayer1 = true;
let gameWon = false;
let isDraw = false;

function getAllCombination(buttons) {
  let lastIndex = () => horizontal.length - 1;
  let indexes = Array.from(buttons, (_, i) => i);
  let horizontal = [];
  for (let i = 0; i < indexes.length; i += 3) {
    horizontal.push(indexes.slice(i, i + 3));
  }
  let vertical = horizontal.map((_, i) => horizontal.map((row) => row[i]));
  let leftDiagonal = horizontal.map((_, i) => horizontal[i][i]);
  let rightDiagonal = horizontal.map((_, i) => horizontal[i][lastIndex() - i]);
  return [...horizontal, ...vertical, leftDiagonal, rightDiagonal];
}

function checkResult(combinations) {
  let winningCombination = [];
  for (const combination of combinations) {
    gameWon = combination.every((index) => {
      let cellContent = buttons[index].textContent;
      let firstCell = buttons[combination[0]].textContent;
      return cellContent === firstCell && cellContent !== "";
    });
    if (gameWon) {
      winningCombination = combination;
      break;
    }
  }
  if (!gameWon) {
    isDraw = Array.from(buttons).every((button) => Boolean(button.textContent));
  }
  return winningCombination;
}

function updateResult(winningCells) {
  overlay.classList.add("show-overlay");
  resetBtn.classList.add("show-btn");
  gameInfo.classList.add("animate__tada");
  if (isDraw) {
    scoreCount.tie++;
    scoreTie.textContent = scoreCount.tie;
    gameInfo.textContent = "It is a Draw!!";
  }
  if (gameWon) {
    isPlayer1 ? scoreCount.player1++ : scoreCount.player2++;
    scorePlayer1.textContent = scoreCount.player1;
    scorePlayer2.textContent = scoreCount.player2;
    gameInfo.textContent = "We have a Winner!!";
    winningCells.forEach((index) => {
      buttons[index].classList.add("animate__flash");
    });
  }
}

function handleClick(event) {
  let button = event.target;
  if (isPlayer1) {
    button.textContent = "X";
    button.classList.add("is-player1");
  } else {
    button.textContent = "O";
  }
  button.disabled = true;
  let combinations = getAllCombination(buttons);
  let winningCells = checkResult(combinations);
  let isGameOver = gameWon || isDraw;
  isGameOver ? updateResult(winningCells) : (isPlayer1 = !isPlayer1);
}

function handleReset() {
  overlay.classList.remove("show-overlay");
  gameInfo.classList.remove("animate__tada");
  isPlayer1 = true;
  gameWon = false;
  isDraw = false;
  buttons.forEach((button) => {
    button.classList.remove("is-player1");
    button.classList.remove("animate__flash");
    button.innerText = "";
    button.disabled = false;
  });
  gameInfo.innerText = "";
  resetBtn.classList.remove("show-btn");
}

buttons.forEach((button) => {
  button.addEventListener("click", handleClick);
});
resetBtn.addEventListener("click", handleReset);
