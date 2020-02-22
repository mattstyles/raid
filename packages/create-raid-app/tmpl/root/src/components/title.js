
import styled from 'styled-components'
import PropTypes from 'prop-types'

const H1 = styled('h1')`
  font-size: 2.8rem;
  line-height: 3.2rem;
`

export const Title = ({ text, children }) => (
  <H1>
    {children || text}
  </H1>
)

Title.propTypes = {
  text: PropTypes.string
}

Title.defaultProps = {
  text: null
}
