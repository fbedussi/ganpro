import React from 'react'

const Header = ({ title, pre }: { title: string; pre?: JSX.Element }) => {
  return (
    <header className="container">
      {pre}
      <h1>{title}</h1>
    </header>
  )
}

export default Header
