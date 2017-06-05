
const stylesheet = {
  view: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row'
  },
  main: {
    position: 'relative',
    flex: 1,
    padding: '12px',
    boxSizing: 'border-box',
    overflow: 'scroll',
    height: '100vh'
  },
  code: {
    flex: 1,
    fontFamily: 'Source Code Pro, consolas, monospace',
    fontSize: 15,
    margin: 0,
    padding: '4px 12px',
    background: 'rgb(32,34,40)',
    color: 'rgb(255,255,255)',
    borderLeft: '1px solid rgb(10,12,18)',
    overflow: 'scroll',
    height: '100vh',
    boxSizing: 'border-box'
  }
}

export const View = ({children}) => {
  return (
    <div style={stylesheet.view}>
      {children}
    </div>
  )
}

export const Main = ({styles, children}) => {
  return (
    <div style={{...stylesheet.main, ...styles}}>
      {children}
    </div>
  )
}

export const Code = ({children}) => {
  return (
    <div style={stylesheet.code}>
      {children}
    </div>
  )
}

export const App = ({state, children}) => {
  return (
    <View>
      <Main>
        {children}
      </Main>
      <Code>
        <pre>{JSON.stringify(state, null, '  ')}</pre>
      </Code>
    </View>
  )
}
