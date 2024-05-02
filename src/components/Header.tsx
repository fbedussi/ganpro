import React from 'react'

const Header = ({ title }: { title: string }) => {
  return (
    <header className="container">
      <h1>{title}</h1>
    </header>
  )
}

export default Header
