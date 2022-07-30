const selectOne = arr => arr[Math.floor(Math.random() * arr.length)]
const delayExecution = duration => new Promise(resolve => setTimeout(resolve, duration))

export { selectOne, delayExecution }
