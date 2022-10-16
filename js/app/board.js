const board = {
  getCurrent (board) {
    const columns = Array.from(board, ({ textContent: symbol }, index) => ({ symbol, index }))
    const horizontal = Array.from({ length: 3 }).map((_, i) => columns.slice(i * 3, i * 3 + 3))
    const vertical = horizontal.map((_, i) => horizontal.map(row => row[i]))
    const leftDiagonal = horizontal.map((_, i) => horizontal[i][i])
    const rightDiagonal = horizontal.map((_, i) => horizontal[i][horizontal.length - i - 1])
    return [...horizontal, ...vertical, leftDiagonal, rightDiagonal]
  }
}
export default board
