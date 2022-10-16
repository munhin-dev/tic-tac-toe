const selectOne = (arr) => arr[Math.floor(Math.random() * arr.length)];

const delayExecution = (duration, board) => {
  board.forEach((column) => (column.style.pointerEvents = "none"));
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve();
      board.forEach((column) => (column.style.pointerEvents = "auto"));
    }, duration)
  );
};

export { selectOne, delayExecution };
