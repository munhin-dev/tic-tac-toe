const gameBoard = document.querySelectorAll(".game-board button");
const restartBtn = document.querySelector(".reset-btn");
const gameInfo = document.querySelector(".game-info");
const overlay = document.querySelector(".overlay");
const scoreBoard = document.querySelector(".scoreboard");
const opponentName = document.querySelector(".opponent-name");
const gameMode = document.querySelector(".game-mode");
const scorePlayer1 = document.querySelector(".player-1-score");
const scorePlayer2 = document.querySelector(".player-2-score");
const scoreTie = document.querySelector(".tie-score");
const score = { player1: 0, player2: 0, tie: 0 };
let isBotPlaying = true;
let isPlayer1 = true;
let isGameOver = false;

function getWinningCombinations(board) {
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
  const combinations = getWinningCombinations(gameBoard);
  let gameWon = false;
  let isDraw = false;
  let winningRow = [];
  for (const combination of combinations) {
    gameWon = combination.every((index) => {
      const cellContent = gameBoard[index].textContent;
      const firstCell = gameBoard[combination[0]].textContent;
      return cellContent === firstCell && cellContent !== "";
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
    score.tie++;
    scoreTie.textContent = score.tie;
    gameInfo.textContent = "It is a Draw!!";
  }
  if (gameWon) {
    isPlayer1 ? score.player1++ : score.player2++;
    scorePlayer1.textContent = score.player1;
    scorePlayer2.textContent = score.player2;
    gameInfo.textContent = "We have a Winner!!";
    indexes.forEach((index) => {
      gameBoard[index].classList.add("animate__flash");
    });
  }
}

function addBotMove(board) {
  function randomIndex(num) {
    return Math.floor(Math.random() * num);
  }

  function getSymbol(player) {
    return player ? "O" : "X";
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
    const emptyColumns = [];
    board.forEach((column, index) => {
      if (!column.disabled) {
        emptyColumns.push(index);
      }
    });
    return emptyColumns[randomIndex(emptyColumns.length)];
  }

  function applyMove(index) {
    const column = board[index];
    column.textContent = symbol;
    column.classList.add(isPlayer1 ? "is-player2" : "is-player1");
    column.disabled = true;
  }

  const combinations = getWinningCombinations(board);
  const symbol = getSymbol(isPlayer1);
  const opponentSymbol = getSymbol(!isPlayer1);
  const blockingMoves = getMoves(opponentSymbol, combinations);
  const winningMoves = getMoves(symbol, combinations);

  if (winningMoves.length > 0) {
    const index = selectMove(winningMoves);
    applyMove(index);
  } else if (blockingMoves.length > 0) {
    const index = selectMove(blockingMoves);
    applyMove(index);
  } else {
    const index = selectRandomMove();
    applyMove(index);
  }
  isPlayer1 = !isPlayer1;
}

function addMove(event) {
  const column = event.target;
  if (isPlayer1) {
    column.textContent = "X";
    column.classList.add("is-player1");
  } else {
    column.textContent = "O";
    column.classList.add("is-player2");
  }
  column.disabled = true;
}

function handleClick(event) {
  addMove(event);
  let result = getResult();
  if (!isGameOver && isBotPlaying) {
    addBotMove(gameBoard);
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
  score.tie = 0;
  scorePlayer1.textContent = score.player1;
  scorePlayer2.textContent = score.player2;
  scoreTie.textContent = score.tie;
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
