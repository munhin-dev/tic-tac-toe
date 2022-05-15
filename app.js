const gameBoard = document.querySelectorAll(".game-board button");
const resetBtn = document.querySelector(".reset-btn");
const changePlayer = document.querySelector(".change-player");
const gameInfo = document.querySelector(".game-info");
const overlay = document.querySelector(".overlay");
const scorePlayer1 = document.querySelector(".player-1");
const scorePlayer2 = document.querySelector(".player-2");
const scoreTie = document.querySelector(".tie");
let isBotPlaying = true;
let isPlayer1 = true;
let isGameOver = false;

function getWinningCombinations(board) {
  let indexes = Array.from(board, (_, i) => i);
  let horizontal = [];
  let lastIndex = () => horizontal.length - 1;
  for (let i = 0; i < indexes.length; i += 3) {
    horizontal.push(indexes.slice(i, i + 3));
  }
  let vertical = horizontal.map((_, i) => horizontal.map((row) => row[i]));
  let leftDiagonal = horizontal.map((_, i) => horizontal[i][i]);
  let rightDiagonal = horizontal.map((_, i) => horizontal[i][lastIndex() - i]);
  return [...horizontal, ...vertical, leftDiagonal, rightDiagonal];
}

function getResult() {
  let combinations = getWinningCombinations(gameBoard);
  let winningRow = [];
  for (const combination of combinations) {
    gameWon = combination.every((index) => {
      let cellContent = gameBoard[index].textContent;
      let firstCell = gameBoard[combination[0]].textContent;
      return cellContent === firstCell && cellContent !== "";
    });
    if (gameWon) {
      winningRow = combination;
      break;
    }
  }
  if (!gameWon) {
    isDraw = Array.from(gameBoard).every((column) =>
      Boolean(column.textContent)
    );
  }
  isGameOver = isDraw || gameWon;
  return {
    indexes: winningRow,
    gameState: { gameWon: gameWon, isDraw: isDraw },
  };
}

function setScore(indexes, { gameWon, isDraw }) {
  overlay.classList.add("show-overlay");
  resetBtn.classList.add("show-btn");
  gameInfo.classList.add("animate__tada");
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

function setBotMove(board) {
  function randomIndex(num) {
    return Math.floor(Math.random() * num);
  }

  function getSymbol(player) {
    return player ? "O" : "X";
  }

  function getMoves(symbol, combinations) {
    let bestMoves = [];
    for (const combination of combinations) {
      let count = { filledCells: 0, emptyCells: 0 };
      for (const index of combination) {
        let columnContent = board[index].textContent;
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
    let move = moves[randomIndex(moves.length)];
    move.forEach((index) => {
      let column = board[index];
      if (!column.disabled) {
        setMove(index);
      }
    });
  }

  function selectRandomMove() {
    let emptyColumns = [];
    board.forEach((column, index) => {
      if (!column.disabled) {
        emptyColumns.push(index);
      }
    });
    let index = emptyColumns[randomIndex(emptyColumns.length)];
    setMove(index);
  }

  function setMove(index) {
    let column = board[index];
    column.textContent = circle;
    column.classList.add(isPlayer1 ? "is-player2" : "is-player1");
    column.disabled = true;
  }

  let combinations = getWinningCombinations(board);
  let circle = getSymbol(isPlayer1);
  let cross = getSymbol(!isPlayer1);
  let blockingMoves = getMoves(cross, combinations);
  let winningMoves = getMoves(circle, combinations);

  if (winningMoves.length > 0) {
    selectMove(winningMoves);
  } else if (blockingMoves.length > 0) {
    selectMove(blockingMoves);
  } else {
    selectRandomMove();
  }
  isPlayer1 = !isPlayer1;
}

function setPlayerMove(event) {
  let column = event.target;
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
  setPlayerMove(event);
  let result = getResult();
  if (!isGameOver && isBotPlaying) {
    setBotMove(gameBoard);
    result = getResult();
  }
  let { indexes, gameState } = result;
  isGameOver ? setScore(indexes, gameState) : (isPlayer1 = !isPlayer1);
}

function handleReset() {
  overlay.classList.remove("show-overlay");
  gameInfo.classList.remove("animate__tada");
  isPlayer1 = true;
  isGameOver = false;
  gameBoard.forEach((column) => {
    column.classList.remove("is-player1", "is-player2", "animate__flash");
    column.innerText = "";
    column.disabled = false;
  });
  gameInfo.innerText = "";
  resetBtn.classList.remove("show-btn");
}

gameBoard.forEach((column) => {
  column.addEventListener("click", handleClick);
});
resetBtn.addEventListener("click", handleReset);
changePlayer.addEventListener("click", handleChange);
