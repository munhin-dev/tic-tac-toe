const buttons = document.querySelectorAll(".game-board button");
const resetBtn = document.querySelector(".reset-btn");
const gameInfo = document.querySelector(".game-info");
const scoreX = document.querySelector(".player-x");
const scoreO = document.querySelector(".player-o");
const scoreTie = document.querySelector(".tie");
let scoreCount = { playerX: 0, playerO: 0, tie: 0 };
let playersTurn = true;
let hasWinner = false;
let isDraw = false;

function getBoard(buttons) {
  let board = [];
  let getHorizontal = [];

  for (const button of buttons) {
    board.push(button.textContent);
  }
  for (let i = 0; i < board.length; i += 3) {
    getHorizontal.push(board.slice(i, i + 3));
  }
  let getVertical = getHorizontal.map((_, index) =>
    getHorizontal.map((row) => row[index])
  );
  let getLeftDiagonal = getHorizontal.map(
    (_, index) => getHorizontal[index][index]
  );
  let getRightDiagonal = getHorizontal.map(
    (_, index) => getHorizontal[index][getHorizontal.length - index - 1]
  );

  return [...getHorizontal, ...getVertical, getLeftDiagonal, getRightDiagonal];
}

function checkResult(rows) {
  isDraw = Array.from(buttons).every((button) => Boolean(button.textContent));
  if (isDraw) return;
  for (const row of rows) {
    hasWinner = row.every((move) => move === row[0] && move !== "");
    if (hasWinner) break;
  }
}

function updateScore() {
  if (isDraw) {
    scoreCount.tie++;
    scoreTie.textContent = scoreCount.tie;
    return;
  }
  playersTurn ? scoreCount.playerO++ : scoreCount.playerX++;
  scoreX.textContent = scoreCount.playerX;
  scoreO.textContent = scoreCount.playerO;
}

function handleClick(event) {
  let button = event.target;
  playersTurn ? (button.textContent = "X") : (button.textContent = "O");
  playersTurn = !playersTurn;
  button.disabled = true;

  let board = getBoard(buttons);
  checkResult(board);

  if (hasWinner) {
    gameInfo.textContent = "We have a winner!";
    buttons.forEach((button) => {
      button.disabled = true;
    });
    resetBtn.classList.add("show-btn");
    updateScore();
    return;
  }

  if (isDraw) {
    gameInfo.textContent = "We have a draw!";
    resetBtn.classList.add("show-btn");
    updateScore();
    return;
  }
}

function handleReset() {
  playersTurn = true;
  hasWinner = false;
  isDraw = false;
  buttons.forEach((button) => {
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
