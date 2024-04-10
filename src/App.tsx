import { useState } from 'react'
import './App.css'
import { power2 } from './helpers'
import styled from 'styled-components'

const Title = styled.h1`
  color: red;
`

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Title>Vite + React</Title>
      <div className="card">
        <button onClick={() => setCount(count => count + 1)}>count is {count}</button>
        <div>count^2 is {power2(count)}</div>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  )
}

export default App
