
import PropTypes from 'prop-types'

const Title = ({text, children}) => (
  <h1 className='h1'>
    {children || text}
    <style jsx>{`
      font-size: 2.8rem;
    `}</style>
  </h1>
)

Title.propTypes = {
  text: PropTypes.string
}

Title.defaultProps = {
  text: null
}

export default Title
