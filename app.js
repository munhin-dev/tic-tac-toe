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

function getWinCombinations(buttons) {
  let lastIndex = () => horizontal.length - 1;
  let allMoves = Array.from(buttons).map((button) => button.textContent);
  let horizontal = [];
  for (let i = 0; i < allMoves.length; i += 3) {
    horizontal.push(allMoves.slice(i, i + 3));
  }
  let vertical = horizontal.map((_, i) => horizontal.map((row) => row[i]));
  let leftDiagonal = horizontal.map((_, i) => horizontal[i][i]);
  let rightDiagonal = horizontal.map((_, i) => horizontal[i][lastIndex() - i]);
  return [...horizontal, ...vertical, leftDiagonal, rightDiagonal];
}

function checkWinner(combinations) {
  for (const combination of combinations) {
    gameWon = combination.every(
      (move) => move === combination[0] && move !== ""
    );
    if (gameWon) break;
  }
  if (!gameWon) {
    isDraw = Array.from(buttons).every((button) => Boolean(button.textContent));
  }
}

function updateScore() {
  if (isDraw) {
    scoreCount.tie++;
    scoreTie.textContent = scoreCount.tie;
    return;
  }
  isPlayer1 ? scoreCount.player2++ : scoreCount.player1++;
  scorePlayer1.textContent = scoreCount.player1;
  scorePlayer2.textContent = scoreCount.player2;
}

function handleClick(event) {
  let button = event.target;
  if (isPlayer1) {
    button.textContent = "X";
    button.classList.add("player1-move");
  } else {
    button.textContent = "O";
  }
  isPlayer1 = !isPlayer1;
  button.disabled = true;
  let allCombinations = getWinCombinations(buttons);
  checkWinner(allCombinations);
  if (gameWon || isDraw) {
    updateScore();
    overlay.classList.add("show-overlay");
    resetBtn.classList.add("show-btn");
    gameWon
      ? (gameInfo.textContent = "We have a Winner!!")
      : (gameInfo.textContent = "It is a Draw!!");
  }
}

function handleReset() {
  overlay.classList.remove("show-overlay");
  isPlayer1 = true;
  gameWon = false;
  isDraw = false;
  buttons.forEach((button) => {
    button.classList.remove("player1-move");
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
