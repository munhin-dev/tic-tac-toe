const cells = document.querySelectorAll(".game-board button");
const resetBtn = document.querySelector(".reset-btn");
const gameInfo = document.querySelector(".game-info");
const scoreX = document.querySelector(".player-x");
const scoreO = document.querySelector(".player-o");
const scoreTie = document.querySelector(".tie");
let scoreCount = { playerX: 0, playerO: 0, tie: 0 };
let playersXTurn = true;
let gameWon = false;
let isDraw = false;

function getWinningCombinations(cells) {
  let cellsContent = [];
  let getHorizontal = [];

  for (const cell of cells) {
    cellsContent.push(cell.textContent);
  }
  for (let i = 0; i < cellsContent.length; i += 3) {
    getHorizontal.push(cellsContent.slice(i, i + 3));
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

function checkResult(combinations) {
  for (const combination of combinations) {
    gameWon = combination.every(
      (cell) => cell === combination[0] && cell !== ""
    );
    if (gameWon) break;
  }
  if (!gameWon) {
    isDraw = Array.from(cells).every((cell) => Boolean(cell.textContent));
  }
}

function updateScore() {
  if (isDraw) {
    scoreCount.tie++;
    scoreTie.textContent = scoreCount.tie;
    return;
  }
  playersXTurn ? scoreCount.playerO++ : scoreCount.playerX++;
  scoreX.textContent = scoreCount.playerX;
  scoreO.textContent = scoreCount.playerO;
}

function handleClick(event) {
  let button = event.target;
  playersXTurn ? (button.textContent = "X") : (button.textContent = "O");
  playersXTurn = !playersXTurn;
  button.disabled = true;

  let allCombinations = getWinningCombinations(cells);
  checkResult(allCombinations);

  if (gameWon || isDraw) {
    resetBtn.classList.add("show-btn");
    updateScore();
    if (gameWon) {
      gameInfo.textContent = "We have a winner!";
      cells.forEach((button) => {
        button.disabled = true;
      });
    }
    if (isDraw) {
      gameInfo.textContent = "It is a draw!";
    }
  }
}

function handleReset() {
  playersXTurn = true;
  gameWon = false;
  isDraw = false;
  cells.forEach((button) => {
    button.innerText = "";
    button.disabled = false;
  });
  gameInfo.innerText = "";
  resetBtn.classList.remove("show-btn");
}

cells.forEach((button) => {
  button.addEventListener("click", handleClick);
});
resetBtn.addEventListener("click", handleReset);
