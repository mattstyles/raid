
export default props => {
  return (
    <button
      style={{
        background: props.background,
        ...props.styles
      }}
      className={`Btn ${props.classes || ''}`}
      onClick={props.onClick}
    >
      {props.children}
      <style jsx>{`
        .Btn {
          padding: .85em 1.33em;
          border-radius: 3px;
          border: none;
          background: rgb(49, 162, 242);
          color: rgb(249, 249, 249);
          font-size: 1.6rem;
          line-height: 1;
          font-weight: 400;
          text-shadow: 0px 1px 1px rgba(0, 0, 0, .25);
          margin-right: 8px;
          cursor: pointer;
        }
      `}</style>
    </button>
  )
}
