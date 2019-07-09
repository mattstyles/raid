
import PropTypes from 'prop-types'

export const {{componentName}} = ({ text, children }) => (
  <h1 className='h1'>
    {children || text}
    <style jsx>{`
      .h1 {
        font-size: 1.2rem;
      }
    `}</style>
  </h1>
)

{{componentName}}.propTypes = {
  text: PropTypes.string
}

{{componentName}}.defaultProps = {
  text: null
}
