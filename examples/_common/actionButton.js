
import theme from './theme'

const Button = ({
  children,
  background,
  styles,
  classes = '',
  onClick
}) => {
  return (
    <button
      style={{
        background,
        ...styles
      }}
      className={`Btn ${classes}`}
      onClick={onClick}
    >
      {children}
      <style jsx>{`
        .Btn {
          padding: 0 1.75rem;
          border-radius: ${theme.borderRadius}px;
          border: none;
          background: ${theme.color.primary};
          color: ${theme.color.white};
          font-size: 1.5rem;
          line-height: 3;
          font-weight: 400;
          text-shadow: 0px 1px 1px rgba(0, 0, 0, .25);
          margin-right: 1rem;
          cursor: pointer;
        }
      `}</style>
    </button>
  )
}

export default Button
