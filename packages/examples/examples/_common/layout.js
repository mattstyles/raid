
import theme from './theme'
import { GlobalStyle } from '@raid/basic-kit'
import styled, { ThemeProvider } from 'styled-components'

export const View = styled('div')`
  display: flex;
  flex: 1;
  flex-direction: row;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  padding: ${props => props.isPadded && props.theme.basePadding + 'rem'};
`

export const Box = styled('div')`
  display: block;
  padding: ${props => props.isPadded && props.theme.basePadding + 'rem'};
  margin: ${props => props.isMargin && props.theme.basePadding + 'rem'};
`

export const Card = styled('div')`
  display: block;
  background: ${props => props.theme.color.white};
  border-radius: ${props => props.theme.borderRadius}px;
  padding: ${props => props.theme.basePadding}rem;
`

export const Main = styled('div')`
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: ${props => props.theme.basePadding}rem;
  box-sizing: border-box;
  overflow: scroll;
  background: ${props => props.theme.colors.background[75]};
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
  font-size: 10px;
  line-height: 14px;
`

// export const GlobalStyle = createGlobalStyle`
//   html {
//     font-size: 10px;
//   }
//   body {
//     margin: 0;
//     background: ${props => props.theme.color.bg};
//     font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
//     color: ${props => props.theme.color.font};
//   }
// `

export const Inline = styled('div')`
  display: inline-block;
`

export const App = ({ state, children }) => {
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
