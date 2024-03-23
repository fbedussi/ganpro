import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import App from './App'

describe('App', () => {
  it('shows a title', () => {
    render(<App />)

    expect(screen.getByRole('heading')).toHaveTextContent('Vite + React')
  })

  it('init the counter to 0', () => {
    render(<App />)
    expect(screen.getByRole('button')).toHaveTextContent(/0/)
  })

  it('increases the counter when the button is pressed', async () => {
    render(<App />)
    expect(screen.getByRole('button')).toHaveTextContent(/0/)
    await userEvent.click(screen.getByText(/count is/))
    expect(screen.getByRole('button')).toHaveTextContent(/1/)
  })
})
