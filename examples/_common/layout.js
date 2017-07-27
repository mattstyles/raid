
import theme from './theme'

export const View = ({styles, children}) => {
  return (
    <div
      className='View'
      style={styles}
    >
      {children}
      <style jsx>{`
        .View {
          display: flex;
          flex: 1;
          flex-direction: row;
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
        }
      `}</style>
    </div>
  )
}

export const Main = ({styles, children}) => {
  return (
    <div
      className='Main'
      style={styles}
    >
      {children}
      <style jsx>{`
        .Main {
          position: relative;
          flex: 1;
          padding: ${theme.basePadding}rem;
          box-sizing: border-box;
          overflow: scroll;
          height: 100vh;
        }
      `}</style>
    </div>
  )
}

export const Code = ({styles, children}) => {
  return (
    <div
      className='Code'
      style={styles}
    >
      {children}
      <style jsx>{`
        .Code {
          flex: 1;
          font-family: 'Source Code Pro', consolas, monospace;
          font-size: ${theme.baseFontSize}rem;
          -webkit-font-smoothing: subpixel-antialiased;
          margin: 0;
          padding: ${theme.basePadding}em;
          background: ${theme.color.codeBg};
          color: ${theme.color.white};
          border-left: 1px solid ${theme.color.border};
          overflow: scroll;
          height: 100vh;
          box-sizing: border-box;
        }
        .Code :global(pre) {
          margin: 0;
          font-family: inherit;
        }
      `}</style>
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
      <style jsx global>{`
        html {
          font-size: 10px;
        }
        body {
          margin: 0;
          background: ${theme.color.bg};
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
          color: ${theme.color.font};
        }
      `}</style>
    </View>
  )
}
