
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Example = styled('div')(
  color: 'red'
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
  text: null
}
