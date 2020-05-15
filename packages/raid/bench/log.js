
/**
 * Outputs for test performance.
 */

function formatNumber (number) {
  number = String(number).split('.')
  return number[0].replace(/(?=(?:\d{3})+$)(?!\b)/g, ',') +
    (number[1] ? '.' + number[1] : '')
}

// `event` is the output of a benchmark cycle
export const printf = event => {
  const target = event.target
  console.log(`${target.name}::`, formatNumber(target.hz).split('.')[0], 'ops/sec')
}
