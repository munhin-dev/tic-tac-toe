import game from "./app/game.js";
import bot from "./app/bot.js";
const gameBoard = document.querySelectorAll(".game-board button");
const overlay = document.querySelector(".overlay");
const scoreBoard = document.querySelector(".scoreboard");

async function handleClick(event) {
  game.addMark(event.target);
  let result = game.checkResult(gameBoard);
  if (!game.isGameOver && game.hasBotPlaying) {
    game.nextPlayerTurn();
    game.addMark(await bot.findMove(gameBoard));
    result = game.checkResult(gameBoard);
  }
  game.isGameOver ? game.handleGameOver(result) : game.nextPlayerTurn();
}

gameBoard.forEach((column) => column.addEventListener("click", handleClick));
overlay.addEventListener("click", game.restartGame);
scoreBoard.addEventListener("click", game.toggleBot);
 