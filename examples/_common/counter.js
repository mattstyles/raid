
import styled from 'styled-components'

export const Count = styled('span')`
  display: inline-block;
  font-size: 28px;
  margin: 0px 16px 0px 8px;
  vertical-align: middle;
  min-width: 20px;
`

export const Counter = styled('div')`
  display: inline-block;
  padding: 8px 0px 8px 8px;
  background: ${props => props.theme.color.white};
  border: 1px solid rgb(230,232,238);
  border-radius: ${props => props.theme.borderRadius}px;
`
