
import styled from 'styled-components'
import { css } from '@styled-system/css'
import PropTypes from 'prop-types'

const Example = styled('div')(
  css({
    color: 'primary'
  })
)

export const {{componentName}} = ({ text, children }) => (
  <Example>
    {children || text}
  </Example>
)

{{componentName}}.propTypes = {
  text: PropTypes.string
}

{{componentName}}.defaultProps = {
  text: ''
}
