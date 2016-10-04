
const styles = {
  view: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row'
  },
  main: {
    flex: 1,
    padding: '12px'
  },
  code: {
    flex: 1,
    fontFamily: 'Source Code Pro, consolas, monospace',
    fontSize: 15,
    margin: 0,
    padding: '4px 12px',
    background: 'rgb(32,34,40)',
    color: 'rgb(255,255,255)',
    borderLeft: '1px solid rgb(10,12,18)'
  }
}

export const View = ({children}) => {
  return (
    <div style={styles.view}>
      {children}
    </div>
  )
}

export const Main = ({children}) => {
  return (
    <div style={styles.main}>
      {children}
    </div>
  )
}

export const Code = ({children}) => {
  return (
    <div style={styles.code}>
      {children}
    </div>
  )
}
