
import React, { Fragment } from 'react'
import { ThemeProvider } from 'styled-components'
import { theme, GlobalStyle } from 'react-basic-kit'

export const App = ({ state, children }) => (
  <ThemeProvider theme={theme}>
    <Fragment>
      <GlobalStyle />
      {children}
    </Fragment>
  </ThemeProvider>
)
