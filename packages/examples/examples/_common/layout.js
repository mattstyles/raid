
import styled, { ThemeProvider } from 'styled-components'
import { css } from '@styled-system/css'
import { GlobalStyle, theme, Pane, Screen, Pre } from '@raid/basic-kit'

export const Main = styled(Pane)(
  css({
    overflow: 'scroll',
    p: 4,
    bg: 'background.75'
  })
)

export const StateBlock = styled(Pre)(
  css({
    fontSize: 'xs',
    bg: 'background.800',
    color: 'white',
    m: 0,
    p: 0,
    borderRadius: 0,
    overflow: 'scroll',
    flex: 1
  })
)

export const App = ({ state, children }) => {
  return (
    <ThemeProvider theme={theme}>
      <Screen sx={{ flexDirection: 'row', display: 'flex' }}>
        <GlobalStyle />
        <Main>
          {children}
        </Main>
        <Pane sx={{ p: 4, bg: 'background.800' }}>
          <StateBlock inset>
            {JSON.stringify(state, null, '  ')}
          </StateBlock>
        </Pane>
      </Screen>
    </ThemeProvider>
  )
}
