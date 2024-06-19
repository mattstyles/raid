/**
 * @param {Raid::Signal} signal - the Raid::Signal to attach to
 * @returns {Func} void - a function to dispose the current update function
 */
export const lock = (signal) => {
  let dispose = null
  const cached = []

  return (fn) => {
    if (dispose) {
      dispose()
    }

    cached.push(fn)
    dispose = signal.register(fn)

    return () => {
      // Dispose from signal, dump from cached update array
      dispose()
      cached.pop()

      // If there was a previous one, reinstate it
      const last = cached.pop()
      if (last) {
        dispose = signal.register(last)
      }
    }
  }
}
