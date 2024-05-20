import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.header`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1rem;

  > * {
    display: flex;
  }

  h1 {
    text-align: center;
    flex: 1;
  }
`

const Header = ({ title, pre }: { title: string; pre?: JSX.Element }) => {
  return (
    <Wrapper className="container">
      {pre}
      <h1>{title}</h1>
    </Wrapper>
  )
}

export default Header
