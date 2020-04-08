
import styled from 'styled-components'
import { css } from '@styled-system/css'
import PropTypes from 'prop-types'

const H1 = styled('h1')(
  css({
    fontSize: 'xl',
    lineHeight: 'xl'
  })
)

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
