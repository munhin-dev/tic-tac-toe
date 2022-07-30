import { delayExecution, selectOne } from '../../utils/index.js'
import board from './board.js'

const bot = {
  checkMoves (symbol, combinations) {
    const moves = []
    for (const combination of combinations) {
      const count = { filledCells: 0, emptyCells: 0 }
      for (const { symbol: content } of combination) {
        if (content === symbol) count.filledCells++
        else if (content === '') count.emptyCells++
        if (count.filledCells === 2 && count.emptyCells === 1) moves.push(combination)
      }
    }
    return moves
  },

  chooseMove (moves) {
    const move = selectOne(moves)
    for (const { symbol, index } of move) {
      if (!symbol) return index
    }
  },

  randomMove (currentBoard) {
    const indexes = Array.from(currentBoard).reduce((indexes, column, index) => {
      if (!column.disabled) indexes.push(index)
      return indexes
    }, [])
    const index = selectOne(indexes)
    return index
  },

  async findMove (currentBoard) {
    await delayExecution(500)
    const combinations = board.getCurrent(currentBoard)
    const winningMoves = bot.checkMoves('O', combinations)
    const blockingMoves = bot.checkMoves('X', combinations)
    if (winningMoves.length > 0) return currentBoard[bot.chooseMove(winningMoves)]
    if (blockingMoves.length > 0) return currentBoard[bot.chooseMove(blockingMoves)]
    return currentBoard[bot.randomMove(currentBoard)]
  }
}

export default bot
