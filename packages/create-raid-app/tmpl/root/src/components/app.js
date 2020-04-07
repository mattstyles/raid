
import React from 'react'
import { ThemeProvider } from 'styled-components'
import { theme, GlobalStyle } from '@raid/basic-kit'

export const App = ({ state, children }) => (
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    {children}
  </ThemeProvider>
)
