import board from './board.js'

const game = (() => {
  const score = { player1: 0, player2: 0, draw: 0 }
  const gameInfo = document.querySelector('.game-info')
  const scoreBoard = document.querySelector('.scoreboard')
  const player1Score = document.querySelector('.player-1-score')
  const player2Score = document.querySelector('.player-2-score')
  const drawScore = document.querySelector('.draw-score')
  const gameBoard = document.querySelectorAll('.game-board button')
  const opponentName = document.querySelector('.opponent-name')
  const overlay = document.querySelector('.overlay')
  const gameMode = document.querySelector('.game-mode')
  let hasBotPlaying = true
  let isPlayer1Turn = true
  let isGameOver = false

  return {
    get isGameOver () {
      return isGameOver
    },

    get hasBotPlaying () {
      return hasBotPlaying
    },

    checkResult (columns) {
      const currentSymbol = isPlayer1Turn ? 'X' : 'O'
      const combinations = board.getCurrent(columns)

      if (Array.from(columns).every(column => column.disabled)) {
        isGameOver = true
        return { gameState: { isDraw: true } }
      }

      for (const combination of combinations) {
        if (combination.every(({ symbol }) => currentSymbol === symbol)) {
          isGameOver = true
          return {
            indexes: combination.map(({ index }) => index),
            gameState: { gameWon: true }
          }
        }
      }
    },

    displayGameOver ({ indexes, gameState: { gameWon = false, isDraw = false } }) {
      if (isDraw) {
        score.draw++
        drawScore.textContent = score.draw
        gameInfo.textContent = 'It is a Draw!!'
      }

      if (gameWon) {
        isPlayer1Turn ? score.player1++ : score.player2++
        player1Score.textContent = score.player1
        player2Score.textContent = score.player2
        gameInfo.textContent = 'We have a Winner!!'
        indexes.forEach(index => gameBoard[index].classList.add('animate__flash'))
      }

      gameInfo.classList.add('animate__tada')
      overlay.style.visibility = 'visible'
    },

    restartGame () {
      isPlayer1Turn = true
      isGameOver = false
      overlay.style.visibility = 'hidden'
      gameInfo.classList.remove('animate__tada')
      gameInfo.textContent = ''
      scoreBoard.style.cursor = 'pointer'
      player1Score.textContent = score.player1
      player2Score.textContent = score.player2
      drawScore.textContent = score.draw
      gameBoard.forEach(column => {
        column.classList.remove('player1', 'player2', 'animate__flash')
        column.textContent = ''
        column.disabled = false
      })
    },

    addMark (column) {
      column.textContent = isPlayer1Turn ? 'X' : 'O'
      column.classList.add(isPlayer1Turn ? 'player1' : 'player2')
      column.disabled = true
    },

    resetScore () {
      score.player1 = 0
      score.player2 = 0
      score.draw = 0
      player1Score.textContent = score.player1
      player2Score.textContent = score.player2
      drawScore.textContent = score.draw
    },

    toggleBot () {
      game.resetScore()
      game.restartGame()
      hasBotPlaying = !hasBotPlaying
      gameMode.textContent = hasBotPlaying ? '1P' : '2P'
      opponentName.textContent = hasBotPlaying ? 'COMPUTER' : 'PLAYER 2'
      scoreBoard.classList.add('animate__flipInY')
      setTimeout(() => scoreBoard.classList.remove('animate__flipInY'), 500)
    },

    nextPlayerTurn () {
      isPlayer1Turn = !isPlayer1Turn
    }
  }
})()

export default game
