const gameBoard = document.querySelectorAll(".game-board button");
const restartBtn = document.querySelector(".reset-btn");
const gameInfo = document.querySelector(".game-info");
const overlay = document.querySelector(".overlay");
const scoreBoard = document.querySelector(".scoreboard");
const opponentName = document.querySelector(".opponent-name");
const gameMode = document.querySelector(".game-mode");
const player1Score = document.querySelector(".player-1-score");
const player2Score = document.querySelector(".player-2-score");
const scoreDraw = document.querySelector(".draw-score");
const score = { player1: 0, player2: 0, draw: 0 };
let isBotPlaying = true;
let isPlayer1 = true;
let isGameOver = false;

function getAllCombinations(board) {
  const indexes = Array.from(board, (_, i) => i);
  const horizontal = [];
  const lastIndex = () => horizontal.length - 1;
  for (let i = 0; i < indexes.length; i += 3) {
    horizontal.push(indexes.slice(i, i + 3));
  }
  const vertical = horizontal.map((_, i) => horizontal.map((row) => row[i]));
  const leftDiagonal = horizontal.map((_, i) => horizontal[i][i]);
  const rightDiagonal = horizontal.map(
    (_, i) => horizontal[i][lastIndex() - i]
  );
  return [...horizontal, ...vertical, leftDiagonal, rightDiagonal];
}

function getResult() {
  const combinations = getAllCombinations(gameBoard);
  let symbol = isPlayer1 ? "X" : "O";
  let gameWon = false;
  let isDraw = false;
  let winningRow = [];
  for (const combination of combinations) {
    gameWon = combination.every((index) => {
      const columnContent = gameBoard[index].textContent;
      return columnContent === symbol;
    });
    if (gameWon) {
      winningRow = combination;
      break;
    }
  }
  if (!gameWon) {
    isDraw = Array.from(gameBoard).every((column) => column.disabled);
  }
  isGameOver = isDraw || gameWon;
  return {
    indexes: winningRow,
    gameState: { gameWon, isDraw },
  };
}

function setScore(indexes, { gameWon, isDraw }) {
  if (isDraw) {
    score.draw++;
    scoreDraw.textContent = score.draw;
    gameInfo.textContent = "It is a Draw!!";
  }
  if (gameWon) {
    isPlayer1 ? score.player1++ : score.player2++;
    player1Score.textContent = score.player1;
    player2Score.textContent = score.player2;
    gameInfo.textContent = "We have a Winner!!";
    indexes.forEach((index) => {
      gameBoard[index].classList.add("animate__flash");
    });
  }
}

function findBotMove(board) {
  function randomIndex(num) {
    return Math.floor(Math.random() * num);
  }

  function getMoves(symbol, combinations) {
    const bestMoves = [];
    for (const combination of combinations) {
      const count = { filledCells: 0, emptyCells: 0 };
      for (const index of combination) {
        const columnContent = board[index].textContent;
        if (columnContent === symbol) {
          count.filledCells++;
        } else if (columnContent === "") {
          count.emptyCells++;
        }
        if (count.filledCells === 2 && count.emptyCells === 1) {
          bestMoves.push(combination);
        }
      }
    }
    return bestMoves;
  }

  function selectMove(moves) {
    const move = moves[randomIndex(moves.length)];
    for (const index of move) {
      const column = board[index];
      if (!column.disabled) {
        return index;
      }
    }
  }

  function selectRandomMove() {
    const indexes = [];
    board.forEach((column, index) => {
      if (!column.disabled) {
        indexes.push(index);
      }
    });
    return indexes[randomIndex(indexes.length)];
  }

  const combinations = getAllCombinations(board);
  const symbol = isPlayer1 ? "O" : "X";
  const opponentSymbol = isPlayer1 ? "X" : "O";
  const blocking = getMoves(opponentSymbol, combinations);
  const winning = getMoves(symbol, combinations);
  isPlayer1 = !isPlayer1;
  if (winning.length > 0) {
    return selectMove(winning);
  } else if (blocking.length > 0) {
    return selectMove(blocking);
  } else {
    return selectRandomMove();
  }
}

function addMark(column) {
  column.textContent = isPlayer1 ? "X" : "O";
  column.classList.add(isPlayer1 ? "is-player1" : "is-player2");
  column.disabled = true;
}

function handleClick(event) {
  const column = event.target;
  addMark(column);
  let result = getResult();
  if (!isGameOver && isBotPlaying) {
    const index = findBotMove(gameBoard);
    const column = gameBoard[index];
    addMark(column);
    result = getResult();
  }
  const { indexes, gameState } = result;
  if (isGameOver) {
    setScore(indexes, gameState);
    overlay.classList.add("show-overlay");
    restartBtn.classList.add("show-btn");
    gameInfo.classList.add("animate__tada");
    scoreBoard.style.cursor = "auto";
  } else {
    isPlayer1 = !isPlayer1;
  }
}

function restartGame() {
  overlay.classList.remove("show-overlay");
  gameInfo.classList.remove("animate__tada");
  isPlayer1 = true;
  isGameOver = false;
  gameBoard.forEach((column) => {
    column.classList.remove("is-player1", "is-player2", "animate__flash");
    column.textContent = "";
    column.disabled = false;
  });
  gameInfo.textContent = "";
  restartBtn.classList.remove("show-btn");
  scoreBoard.style.cursor = "pointer";
}

function resetScore() {
  score.player1 = 0;
  score.player2 = 0;
  score.draw = 0;
  player1Score.textContent = score.player1;
  player2Score.textContent = score.player2;
  scoreDraw.textContent = score.draw;
}

function toggleBot() {
  if (!isGameOver) {
    restartGame();
    resetScore();
    isBotPlaying = !isBotPlaying;
    gameMode.textContent = isBotPlaying ? "1P" : "2P";
    opponentName.textContent = isBotPlaying ? "COMPUTER" : "PLAYER 2";
    scoreBoard.classList.add("animate__flipInY");
    setTimeout(() => {
      scoreBoard.classList.remove("animate__flipInY");
    }, 500);
  }
}

gameBoard.forEach((column) => {
  column.addEventListener("click", handleClick);
});
restartBtn.addEventListener("click", restartGame);
scoreBoard.addEventListener("click", toggleBot);
