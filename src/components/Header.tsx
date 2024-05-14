import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.header`
  display: flex;
  align-items: center;
  gap: 1rem;
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
