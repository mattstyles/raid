
import theme from './theme'
import styled, {createGlobalStyle, ThemeProvider} from 'styled-components'

export const View = styled('div')`
  display: flex;
  flex: 1;
  flex-direction: row;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
`

export const Main = styled('div')`
  position: relative;
  flex: 1;
  padding: ${props => props.theme.basePadding}rem;
  box-sizing: border-box;
  overflow: scroll;
  height: 100vh;
`
export const Code = styled('pre')`
  flex: 1;
  font-family: 'Source Code Pro', consolas, monospace;
  font-size: ${props => props.theme.baseFontSize}rem;
  -webkit-font-smoothing: subpixel-antialiased;
  margin: 0;
  padding: ${props => props.theme.basePadding}em;
  background: ${props => props.theme.color.codeBg};
  color: ${props => props.theme.color.white};
  border-left: 1px solid ${props => props.theme.color.border};
  overflow: scroll;
  height: 100vh;
  box-sizing: border-box;
`

export const GlobalStyle = createGlobalStyle`
  html {
    font-size: 10px;
  }
  body {
    margin: 0;
    background: ${props => props.theme.color.bg};
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
    color: ${props => props.theme.color.font};
  }
`

// export const View = ({styles, children}) => {
//   return (
//     <div
//       className='View'
//       style={styles}
//     >
//       {children}
//       <style jsx>{`
//         .View {
//           display: flex;
//           flex: 1;
//           flex-direction: row;
//           min-height: 100vh;
//           -webkit-font-smoothing: antialiased;
//         }
//       `}</style>
//     </div>
//   )
// }
//
// export const Main = ({styles, children}) => {
//   return (
//     <div
//       className='Main'
//       style={styles}
//     >
//       {children}
//       <style jsx>{`
//         .Main {
//           position: relative;
//           flex: 1;
//           padding: ${theme.basePadding}rem;
//           box-sizing: border-box;
//           overflow: scroll;
//           height: 100vh;
//         }
//       `}</style>
//     </div>
//   )
// }
//
// export const Code = ({styles, children}) => {
//   return (
//     <div
//       className='Code'
//       style={styles}
//     >
//       {children}
//       <style jsx>{`
//         .Code {
//           flex: 1;
//           font-family: 'Source Code Pro', consolas, monospace;
//           font-size: ${theme.baseFontSize}rem;
//           -webkit-font-smoothing: subpixel-antialiased;
//           margin: 0;
//           padding: ${theme.basePadding}em;
//           background: ${theme.color.codeBg};
//           color: ${theme.color.white};
//           border-left: 1px solid ${theme.color.border};
//           overflow: scroll;
//           height: 100vh;
//           box-sizing: border-box;
//         }
//         .Code :global(pre) {
//           margin: 0;
//           font-family: inherit;
//         }
//       `}</style>
//     </div>
//   )
// }

export const App = ({state, children}) => {
  return (
    <ThemeProvider theme={theme}>
      <View>
        <GlobalStyle />
        <Main>
          {children}
        </Main>
        <Code>
          {JSON.stringify(state, null, '  ')}
        </Code>
      </View>
    </ThemeProvider>
  )
}
